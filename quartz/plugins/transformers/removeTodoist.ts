import { QuartzTransformerPlugin } from "../types"

export const RemoveTodoist: QuartzTransformerPlugin = () => {
  return {
    name: "RemoveTodoist",
    textTransform(_ctx, src) {
      // Remove todoist code blocks: ```todoist ... ```
      // This regex matches ```todoist followed by any content until the closing ```
      return src.replace(/```todoist[\s\S]*?```/g, "")
    },
  }
}
