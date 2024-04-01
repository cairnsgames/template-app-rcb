# Simple-Hash-Router

## Usage

<Router>
    <Route is={"home"}><HomePage /></Route> // Matches #home, #homepage etc
    <Route startsWith={"home"}><HomePage /></Route>  // Matches #home, #homepage etc
    <Route is={"home/{id}"}><HomePage /></Route> // Matches #home/1 and passes id={1} to HomePage
    <Route if={condition}><HomePage /></Route> // calls homepage is Condition is true
    <DefaultPage />
</Router>

is = match, and can contain template - any number of fields
startsWith = exact match to start
if = matches if the condition passed is true

With is, the parameters are extracted and passed to all children by name