"use client";

import React, { useState, useEffect, useRef } from "react";
import { Plus, Archive, Trash2, RotateCcw, FileText} from "lucide-react";
import styles from "./ProjectSidebar.module.css";
import AnchorSelectionModal from "./AnchorSelectionModal";
import ProjectDescriptionModal from "./ProjectDescriptionModal";

interface Project {
  id: string;
  name: string;
  status: "active" | "archived" | "deleted";
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    sessions: number;
  };
}

interface ProjectSidebarProps {
  onProjectSelect: (projectId: string) => void;
  selectedProjectId: string | null;
  refreshKey?: number;
  isOpen?: boolean;
  onCollapse?: () => void;
  onExpand?: () => void;
}

export default function ProjectSidebar({
  onProjectSelect,
  selectedProjectId,
  refreshKey,
  isOpen = true,
  onCollapse,
  onExpand,
}: ProjectSidebarProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showArchived, setShowArchived] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    projectId: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAnchorModal, setShowAnchorModal] = useState(false);
  const [availableSystems, setAvailableSystems] = useState<any[]>([]);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    fetchProjects();
  }, [showArchived, refreshKey]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const status = showArchived ? undefined : "active";
      const url = status ? `/api/projects?status=${status}` : "/api/projects";

      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) throw new Error("Failed to fetch projects");

      const data = await response.json();
      setProjects(data.projects);
      setError(null);
    } catch (err) {
      setError("Failed to load projects");
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSystems = async () => {
    try {
      // Use any project ID to get available systems (or create a dedicated endpoint)
      const res = await fetch(`/api/projects/initialize-info`);
      if (res.ok) {
        const data = await res.json();
        setAvailableSystems(data.availableSystems || []);
      }
    } catch (err) {
      console.error("Error fetching anchor systems:", err);
    }
  };

  const handleCreateProjectWithInitialization = async (config: {
    projectName: string;
    useExisting: boolean;
    anchorSystemName?: string;
    chunksPath?: string;
  }) => {
    setShowAnchorModal(false);

    try {
      // Step 1: Create the project
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: config.projectName }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create project");
      }

      const data = await response.json();
      const newProject = data.project;

      // Step 2: Initialize FAISS indexes
      const initPayload = config.useExisting
        ? {
            useExistingAnchors: true,
            anchorSystemName: config.anchorSystemName,
          }
        : {
            useExistingAnchors: false,
            chunksPath: config.chunksPath,
          };

      const initResponse = await fetch(
        `/api/projects/${newProject.id}/initialize`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(initPayload),
        }
      );

      if (!initResponse.ok) {
        const initData = await initResponse.json();
        console.warn("Failed to initialize project:", initData.error);
        alert(
          `Project created but initialization failed: ${initData.error}\nYou may need to initialize it manually.`
        );
      } else {
        console.log("Project initialized successfully");
      }

      // Refresh project list
      await fetchProjects();

      // Select the new project
      onProjectSelect(newProject.id);
    } catch (err: any) {
      alert(err.message);
      console.error("Error creating project:", err);
    }
  };

  const handleUpdateProjectStatus = async (
    projectId: string,
    status: "active" | "archived" | "deleted"
  ) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error("Failed to update project");

      await fetchProjects();
      if (selectedProjectId === projectId && status !== "active") {
        onProjectSelect("");
      }
    } catch (err) {
      console.error("Error updating project:", err);
      alert("Failed to update project");
    }
  };

  //new - handler for updating project description
  const handleUpdateDescription = async (description: string) => {
    if (!editingProject) return;

    try {
      const response = await fetch(`/api/projects/${editingProject.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });

      if (!response.ok) throw new Error("Failed to update description");

      await fetchProjects();
    } catch (err) {
      console.error("Error updating description:", err);
      alert("Failed to update project description");
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      // First, check if project has sessions
      const project = projects.find((p) => p.id === projectId); // new code - find project in current state

      if (project && project._count && project._count.sessions > 0) {
        // new code - check session count
        alert(
          `Cannot delete project "${project.name}" because it has ${project._count.sessions} session(s). Please archive it instead.`
        );
        return; // new code - stop here, don't proceed with delete
      }

      // First confirmation - only shown if project is empty
      const firstConfirm = confirm(
        `Are you sure you want to permanently delete "${project?.name}"? This action cannot be undone.` // changed code - show project name
      );

      if (!firstConfirm) return;

      // Second confirmation
      const secondConfirm = confirm(
        "This is your final warning. The project will be PERMANENTLY deleted. Continue?"
      );

      if (!secondConfirm) return;

      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete project");
      }

      await fetchProjects(); // Refresh list
      if (selectedProjectId === projectId) {
        onProjectSelect(""); // Deselect if deleted
      }

      alert("Project deleted successfully");
    } catch (err: any) {
      console.error("Error deleting project:", err);
      alert(`Delete failed: ${err.message}`);
    }
  };

  const handleContextMenu = (e: React.MouseEvent, projectId: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, projectId });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  useEffect(() => {
    if (contextMenu) {
      document.addEventListener("click", handleCloseContextMenu);
      return () =>
        document.removeEventListener("click", handleCloseContextMenu);
    }
  }, [contextMenu]);

  const getProjectByStatus = (status: "active" | "archived") => {
    return projects.filter((p) => p.status === status);
  };

  const activeProjects = getProjectByStatus("active");
  const archivedProjects = getProjectByStatus("archived");

  if (!isOpen) {
    return (
      <div className={styles.collapsedStub}>
        <button
          className={styles.toggleButton}
          onClick={() => onExpand?.()}
          aria-label="Expand projects"
          title="Expand projects"
        >
          ›
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button
        className={styles.toggleButton}
        onClick={() => onCollapse?.()}
        aria-label="Collapse projects"
        title="Collapse projects"
      >
        ‹
      </button>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          {" "}
          {/* changed code */}
          <h2 className={styles.headerTitle}>Projects</h2> {/* changed code */}
          <button
            onClick={async () => {
              await fetchAvailableSystems();
              setShowAnchorModal(true);
            }}
            className={styles.addButton}
            title="New Project"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <label className={styles.archivedToggle}>
          {" "}
          {/* changed code */}
          <input
            type="checkbox"
            checked={showArchived}
            onChange={(e) => setShowArchived(e.target.checked)}
          />
          Show archived
        </label>
      </div>

      <div className={styles.projectList}>
        {loading && <div className={styles.loadingMessage}>Loading...</div>}{" "}
        {/* changed code */}
        {error && <div className={styles.errorMessage}>{error}</div>}{" "}
        {/* changed code */}
        {!loading && !error && (
          <>
            {activeProjects.length > 0 && (
              <div>
                {activeProjects.map((project) => (
                  <div
                    key={project.id}
                    className={`${styles.projectItem} ${
                      selectedProjectId === project.id
                        ? styles.projectItemActive
                        : ""
                    }`}
                    onClick={() => onProjectSelect(project.id)}
                    onContextMenu={(e) => handleContextMenu(e, project.id)}
                  >
                    <div className={styles.projectItemContent}>
                      {" "}
                      {/* changed code */}
                      <span>{project.name}</span>
                      {project._count && (
                        <span className={styles.projectItemCount}>
                          {" "}
                          {/* changed code */}
                          {project._count.sessions}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {showArchived && archivedProjects.length > 0 && (
              <div className={styles.archivedSection}>
                {" "}
                {/* changed code */}
                <div className={styles.archivedHeader}>Archived</div>
                {archivedProjects.map((project) => (
                  <div
                    key={project.id}
                    className={`${styles.projectItem} ${styles.archivedProject}`}
                    onContextMenu={(e) => handleContextMenu(e, project.id)}
                  >
                    <div className={styles.projectItemContent}>
                      <span>{project.name}</span>
                      {project._count && (
                        <span className={styles.projectItemCount}>
                          {project._count.sessions}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {contextMenu && (
        <div className={styles.contextMenu}>
          {projects.find((p) => p.id === contextMenu.projectId)?.status ===
          "active" ? (
            <>
              <button
                onClick={() => {
                  const project = projects.find(
                    (p) => p.id === contextMenu.projectId
                  ); 
                  setEditingProject(project || null); 
                  setShowDescriptionModal(true); 
                  handleCloseContextMenu();
                }}
                className={styles.contextMenuItem}
              >
                <FileText className="w-4 h-4" /> Project description
              </button>
              <button
                onClick={() => {
                  handleUpdateProjectStatus(contextMenu.projectId, "archived");
                  handleCloseContextMenu();
                }}
                className={styles.contextMenuItem}
              >
                <Archive className="w-4 h-4" />
                Archive
              </button>
              <button
                onClick={() => {
                  handleDeleteProject(contextMenu.projectId); // changed code - calls new delete function
                  handleCloseContextMenu();
                }}
                className={`${styles.contextMenuItem} ${styles.contextMenuItemDanger}`}
              >
                <Trash2 className="w-4 h-4" />
                Delete Permanently {/* changed code - clearer label */}
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                handleUpdateProjectStatus(contextMenu.projectId, "active");
                handleCloseContextMenu();
              }}
              className={styles.contextMenuItem}
            >
              <RotateCcw className="w-4 h-4" />
              Restore
            </button>
          )}
        </div>
      )}
      {/* Anchor Selection Modal */}
      <AnchorSelectionModal
        isOpen={showAnchorModal}
        onClose={() => setShowAnchorModal(false)}
        onConfirm={handleCreateProjectWithInitialization}
        availableSystems={availableSystems}
      />
      {/* new - Project Description Modal */}
      {editingProject && (
        <ProjectDescriptionModal
          isOpen={showDescriptionModal}
          projectId={editingProject.id}
          projectName={editingProject.name}
          currentDescription={editingProject.description ?? null}
          onClose={() => {
            setShowDescriptionModal(false);
            setEditingProject(null);
          }}
          onSave={handleUpdateDescription}
        />
      )}
    </div>
  );
}
