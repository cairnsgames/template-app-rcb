import { MobileDeviceProvider } from "./theme/modiledeviceprovider";
import { ThemeProvider } from "./theme/themeprovider";

// import all providers here, so that in app.js only a single providers file need be imported
const Providers = ({children}) => {
    return (
        <ThemeProvider>
            <MobileDeviceProvider>
                {children}
            </MobileDeviceProvider>
        </ThemeProvider>
    )
}

export default Providers;