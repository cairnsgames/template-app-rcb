import useUser from "../../../../auth/context/useuser";

const PermissionsSummary = () => {
  const { user } = useUser();
  console.log("PERMISSIONS USER", user);
  return (
    <div>
      <h2>Permissions Summary</h2>
      <ul>
        {user?.permissions?.map((permission) => (
          <li key={permission}>
            {permission.name}: {permission.permission}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PermissionsSummary;
