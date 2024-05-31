
import { Star, StarFill } from "react-bootstrap-icons";

const Stars = ({number}) => {
    // return null;
    if (!number || number  < 0.4) { return (<span style={{"color":"purple"}}><Star /><Star /><Star /><Star /><Star /></span>) }
    if (number  < 1.4) { return (<span style={{"color":"purple"}}><StarFill /><Star /><Star /><Star /><Star /></span>)}
    if (number  < 2.4) { return (<span style={{"color":"purple"}}><StarFill /><StarFill /><Star /><Star /><Star /></span>)}
    if (number  < 3.4) { return (<span style={{"color":"purple"}}><StarFill /><StarFill /><StarFill /><Star /><Star /></span>)}
    if (number  < 4.4) { return (<span style={{"color":"purple"}}><StarFill /><StarFill /><StarFill /><StarFill /><Star /></span>)}
    return (<span style={{"color":"purple"}}><StarFill /><StarFill /><StarFill /><StarFill /><StarFill /></span>);
}

export default Stars;