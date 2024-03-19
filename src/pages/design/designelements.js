import Alerts from "./alerts";
import Accordians from "./accordians";
import Badges from "./badges";
import Breadcrumbs from "./breadcrumbs";
import ButtonGroups from "./buttongroups";
import useLocation from "../../hooks/uselocation";
import Cards from "./card";
import Carousels from "./carousels";

const DesignElements = () => {
  const { hash } = useLocation();

  if (hash.includes("accordian")) {
    return <Accordians />;
  }
  if (hash.includes("alert")) {
    return <Alerts />;
  }
  if (hash.includes("badge")) {
    return <Badges />;
  }
  if (hash.includes("breadcrumb")) {
    return <Breadcrumbs />;
  }
  if (hash.includes("buttongroup")) {
    return <ButtonGroups />;
  }
  
  if (hash.includes("cards")) {
    return <Cards />;
  }
  if (hash.includes("carousel")) {
    return <Carousels />;
  }

  return (
    <>
      <a href="#design/accordian">Accordians</a>
      <br />
      <a href="#design/alert">Alerts</a>
      <br />
      <a href="#design/badge">Badges</a>
      <br />
      <a href="#design/breadcrumb">Breadcrumbs</a>
      <br />
      <a href="#design/buttongroup">Button Groups</a>
      <br />      
      <a href="#design/cards">Card</a>
      <br />
      <a href="#design/carousela">Carousel</a>
    </>
  );
};

export default DesignElements;
