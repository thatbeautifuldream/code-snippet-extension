import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Copy, Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { GistsService } from "../../services/github/gists.service";
import { Button } from "../ui/button";

// Initialize the relative time plugin
dayjs.extend(relativeTime);

export function GitHubGists() {
  const [selectedGistId, setSelectedGistId] = useState<string | null>(null);
  const [copiedFileId, setCopiedFileId] = useState<string | null>(null);

  const { data: gists, isLoading } = useQuery({
    queryKey: ["gists"],
    queryFn: () => GistsService.listGistsForUser("thatbeautifuldream"),
  });

  const { data: gistContent } = useQuery({
    queryKey: [`gist-${selectedGistId}`],
    queryFn: async () => {
      if (!selectedGistId) return null;
      return GistsService.getGist(selectedGistId);
    },
    enabled: !!selectedGistId,
  });

  const copyToClipboard = async (text: string, fileId: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedFileId(fileId);
    setTimeout(() => {
      setCopiedFileId(null);
    }, 2000); // Reset after 2 seconds
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        Loading gists...
      </div>
    );
  }

  return (
    <div className="h-full relative overflow-hidden">
      {/* Gist List */}
      <motion.div
        initial={false}
        animate={{ x: selectedGistId ? -300 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-full h-full"
      >
        <div className="border rounded-lg p-4 overflow-y-auto h-full">
          <h2 className="text-xl font-bold mb-4">Your Gists</h2>
          <div className="space-y-2">
            {gists?.map((gist) => (
              <motion.div
                key={gist.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-2 rounded cursor-pointer hover:bg-accent ${
                  selectedGistId === gist.id ? "bg-accent" : ""
                }`}
                onClick={() => setSelectedGistId(gist.id)}
              >
                <div className="font-medium">
                  {Object.keys(gist.files)[0] || "Untitled"}
                </div>
                <div className="text-sm text-muted-foreground">
                  {dayjs(gist.created_at).fromNow()}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Gist Content */}
      <AnimatePresence>
        {selectedGistId && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute top-0 left-0 w-full h-full bg-background"
          >
            <div className="border rounded-lg p-4 h-full overflow-y-auto">
              <div className="flex items-center gap-2 mb-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedGistId(null)}
                  className="hover:bg-accent rounded-full"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <h2 className="text-xl font-bold">
                  {
                    Object.keys(
                      gists?.find((g) => g.id === selectedGistId)?.files || {}
                    )[0]
                  }
                </h2>
              </div>

              {gistContent && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {Object.entries(gistContent?.files || {}).map(
                    ([filename, file]) => (
                      <div key={filename} className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-lg font-medium">{filename}</h3>
                          <Button
                            onClick={() =>
                              copyToClipboard(file?.content || "", filename)
                            }
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            {copiedFileId === filename ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                        <motion.pre
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="bg-muted p-4 rounded-lg overflow-x-auto"
                        >
                          <code>{file?.content}</code>
                        </motion.pre>
                      </div>
                    )
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
