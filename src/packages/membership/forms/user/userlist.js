import { Person } from "react-bootstrap-icons";
import Tracker from "../../../tracker/tracker";
import { useMembership } from "../../context/usemembership";
import {Button, Table} from "react-bootstrap";
import useUser from "../../../auth/context/useuser";
import useAuth from "../../../auth/context/useauth";

const UserList = () => {
    const { users } = useMembership();
    const { hasAccess } = useUser();
    const { impersonate } = useAuth();
    
    console.log("UsersList", users)

    const impersonateUser = (id) => {
      alert("Impersonate User " + id);
      if (impersonate(id)) {
        window.location.hash = "home";
      }
    }

  return (
    <Tracker itemtype="users" id={0}>
      <h1>Application Users</h1>
      <Table>
        {users.map((user) => (
          <tr key={user.id}>
            <td><a href={`#admin/user/${user.id}`}>{user.email}</a></td>
            <td>
              {hasAccess("ImpersonateUser") &&
              <Button size="sm" variant="outline-primary" onClick={()=>{impersonateUser(user.id)}}><Person /></Button>}
            </td>
          </tr>
        ))}
      </Table>
    </Tracker>
  );
};

export default UserList;
