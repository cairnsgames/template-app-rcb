import { MembershipProvider } from "./context/membershipsprovider"

const Membership = ({children}) => {

    return (<MembershipProvider>
        {children}
    </MembershipProvider>)
}

export default Membership;

