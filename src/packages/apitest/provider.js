import React, { createContext, useContext, useState, useEffect } from "react";
import useGAPIV2 from "../../hooks/usegapiv2";

const APITestContext = createContext();

export const useAPITest = () => useContext(APITestContext);

export const APITestProvider = ({ children }) => {
  const [activeProject, setActiveProject] = useState(null);
  const [selectedCall, setSelectedCall] = useState(null);
  const {
    data: projects,
    insert: insertProject,
    update: updateProject,
    refresh: refreshProjects,
  } = useGAPIV2("project", { shouldLoad: true });
  const { data: calls, refresh: refreshCalls } = useGAPIV2(
    `project/${activeProject?.id}/calls`,
    {
      shouldLoad: false //!!activeProject,
    }
  );
  const { insert: insertCall, update: updateCall } = useGAPIV2(`call`, {
    shouldLoad: false,
  });
  const {
    data: defaults,
    insert: insertDefault,
    update: updateDefault,
    refresh: refreshDefaults,
  } = useGAPIV2(`project/${activeProject?.id}/defaults`, {
    shouldLoad: !!activeProject,
  });

  const createOrUpdateProject = async (project) => {
    if (project.id) {
      await updateProject(project);
    } else {
      await insertProject(project);
    }
    refreshProjects();
  };

  const createOrUpdateDefaultHeaders = async (defaultHeaders) => {
    if (defaultHeaders.id) {
      await updateDefault(defaultHeaders);
    } else {
      await insertDefault(defaultHeaders);
    }
  };

  const createOrUpdateCall = async (call) => {
    if (!call.project_id) {
      call.project_id = activeProject?.id;
    }
    if (call.id) {
      call = await updateCall(call);
    } else {
      call = await insertCall(call);
    }
    setSelectedCall(call[0]);
  };

  const executeCall = async (call) => {
    const headers =
      call.headers ||
      defaults.find((d) => d.project_id === activeProject?.id)
        ?.default_headers ||
      {};
    const fetchHeaders = [];
    headers.forEach((header) => {
      fetchHeaders[header.key] = header.value;
    });

    const options = {
      method: call.method ?? "GET",
      headers: { "Content-Type": "application/json", ...fetchHeaders },
    };
    if (call.method === "POST" || call.method === "PUT") {
      options.body = JSON.stringify(call.body);
    }
    const response = await fetch(call.url, options);
    const result = await response.json();
    await updateCall(call);

    return result;
  };

  return (
    <APITestContext.Provider
      value={{
        projects,
        activeProject,
        calls,
        defaults,
        setActiveProject,
        createOrUpdateProject,
        createOrUpdateDefaultHeaders,
        createOrUpdateCall,
        executeCall,
        selectedCall,
        setSelectedCall,
      }}
    >
      {children}
    </APITestContext.Provider>
  );
};
