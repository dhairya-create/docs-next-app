import { Extension } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    lineHeight: {
      /**
       * Set line height for selected blocks
       */
      setLineHeight: (lineHeight: string) => ReturnType;

      /**
       * Unset (remove) line height
       */
      unsetLineHeight: () => ReturnType;
    };
  }
}

export const LineHeightExtension = Extension.create({
  name: "lineHeight",

  addOptions() {
    return {
      types: ["paragraph", "heading"],
      defaultLineHeight: "normal",
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: this.options.defaultLineHeight,
            renderHTML: (attributes) => {
              if (!attributes.lineHeight || attributes.lineHeight === "normal") {
                return {};
              }
              return { style: `line-height: ${attributes.lineHeight}` };
            },
            parseHTML: (element) =>
              element.style.lineHeight || this.options.defaultLineHeight,
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setLineHeight:
        (lineHeight: string) =>
        ({ tr, state, dispatch }) => {
          const { selection } = state;
          const { from, to } = selection;

          // Iterate through selected nodes and update lineHeight attribute
          state.doc.nodesBetween(from, to, (node, pos) => {
            if (this.options.types.includes(node.type.name)) {
              tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                lineHeight,
              });
            }
          });

          if (dispatch) dispatch(tr);
          return true;
        },

      unsetLineHeight:
        () =>
        ({ tr, state, dispatch }) => {
          const { selection } = state;
          const { from, to } = selection;

          // Reset line height back to default for selected nodes
          state.doc.nodesBetween(from, to, (node, pos) => {
            if (this.options.types.includes(node.type.name)) {
              tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                lineHeight: this.options.defaultLineHeight,
              });
            }
          });

          if (dispatch) dispatch(tr);
          return true;
        },
    };
  },
});
