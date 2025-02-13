import { GitHubGists } from "./components/snippets/github-gists";

function App() {
  return (
    <div className="w-full h-screen flex flex-col bg-background text-foreground">
      <GitHubGists />
    </div>
  );
}

export default App;
