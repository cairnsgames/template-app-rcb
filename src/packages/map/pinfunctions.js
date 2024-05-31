import { renderToStaticMarkup } from "react-dom/server";
import { divIcon } from "leaflet";
import {Pin} from "./pin";

export const getRequiredSVGPinByCategory = (category, myStyle) => {
    let pin = <Pin {...myStyle} />;
    const iconMarkup = renderToStaticMarkup(pin);
    const customMarketIcon = divIcon({
        html: iconMarkup,
        className: "custom-icon",
        iconSize: [40, 40],
        iconAnchor: [20, 40],
    });
    return customMarketIcon;
};