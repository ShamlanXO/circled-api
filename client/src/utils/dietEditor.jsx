import React, { useMemo, useRef, useEffect } from "react";
import imageExtensions from "image-extensions";
import isUrl from "is-url";
import {
  Editor,
  Transforms,
  Text,
  createEditor,

} from "slate";
import {
  Slate,
  Editable,
  useSlateStatic,
  useSelected,
  useFocused,
  useSlate,
  withReact,
  ReactEditor,
} from "slate-react";
import { withHistory } from "slate-history";
import LightboxModal from "src/components/LightBoxContainer";
import { Button, Icon, Box, Typography } from "@mui/material";
import Iconify from "src/components/Iconify";
import { handleuploadImage } from "src/utils/uploader";
import { dispatch } from "src/redux/store";
import ReactDOM from "react-dom";
const SlateEditor = ({ onChange, value }) => {
  const editor = useMemo(
    () => withImages(withHistory(withReact(createEditor()))),
    []
  );

  return (
    <Slate
      editor={editor}
      value={[...value]}
      onChange={(value) => {
        const isAstChange = editor.operations.some(
          (op) => "set_selection" !== op.type
        );
        if (isAstChange) {
          // Save the value to Local Storage.
          const content = JSON.stringify(value);
          onChange(content);
        }
      }}
    >
      <Box height={"100%"} pb={2}>
        <Box
          /* System/Neutrals/200 */
          py={4}
          pb={8}
          height={"100%"}
        >
          {/* <Toolbar>
        <InsertImageButton />
      </Toolbar> */}
          <Box px={2}>
            <HoveringToolbar />
            <Editable
              renderLeaf={(props) => <Leaf {...props} />}
              renderElement={(props) => <Element {...props} />}
              placeholder="Write your meal plan here..."
            />
          </Box>
        </Box>
      </Box>
    </Slate>
  );
};

const withImages = (editor) => {
  const { insertData, isVoid } = editor;

  editor.isVoid = (element) => {
    return element.type === "image" ? true : isVoid(element);
  };

  editor.insertData = (data) => {
    const text = data.getData("text/plain");
    const { files } = data;

    if (files && files.length > 0) {
      for (const file of files) {
        const reader = new FileReader();
        const [mime] = file.type.split("/");

        if (mime === "image") {
          reader.addEventListener("load", () => {
            const url = reader.result;
            insertImage(editor, url);
          });

          reader.readAsDataURL(file);
        }
      }
    } else if (isImageUrl(text)) {
      insertImage(editor, text);
    } else {
      insertData(data);
    }
  };

  return editor;
};

const insertImage = (editor, url) => {
  const text = { text: " " };
  const image = [
    { type: "image", url, children: [text] },
    { type: "paragraph", children: [text] },
  ];
  Transforms.insertNodes(editor, image);
};

const Element = (props) => {
  const { attributes, children, element } = props;

  switch (element.type) {
    case "image":
      return <Image {...props} />;
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const Image = ({ attributes, children, element }) => {
  const editor = useSlateStatic();
  const path = ReactEditor.findPath(editor, element);

  const selected = useSelected();
  const focused = useFocused();
  return (
    <div {...attributes}>
      {children}
      <div
        contentEditable={false}
        style={{
          position: "relative",
        }}
      >
        <LightboxModal image={element.url}>
          <img
            src={element.url}
            style={{
              borderRadius: "8px",
              display: "block",
              maxWidth: "100%",
              maxHeight: "20em",
              boxShadow: selected && focused ? "0 0 0 3px #B4D5FF" : "none",
            }}
          />
        </LightboxModal>
        <Button
          active
          onClick={() => Transforms.removeNodes(editor, { at: path })}
          style={{
            display: selected && focused ? "inline" : "none",
            position: "absolute",
            top: "0.5em",
            left: "0.5em",
            background: "white",
          }}
        >
          <Icon>delete</Icon>
        </Button>
      </div>
    </div>
  );
};

const InsertImageButton = () => {
  const editor = useSlateStatic();
  const handleImage = (e) => {
    dispatch({ type: "UPDATE_FEED", payload: { loading: true } });
    handleuploadImage(e).then((res) => {
      dispatch({ type: "UPDATE_FEED", payload: { loading: false } });
      insertImage(editor, res.data.Location);
    });
  };
  return (
    <>
      <input
        type="file"
        id={"dietEditor"}
        accept="image/*"
        onChange={handleImage}
        style={{ display: "none" }}
      />
      <Iconify
        icon={"ph:image"}
        width={24}
        height={24}
        color={"text.secondary"}
        mr={0.5}
        onClick={() => {
          document.getElementById("dietEditor").click();
        }}
      />
      <Typography
        color={"text.secondary"}
        onClick={() => {
          document.getElementById("dietEditor").click();
        }}
      >
        Upload image here
      </Typography>
    </>
  );
};

const toggleFormat = (editor, format) => {
  const isActive = isFormatActive(editor, format);
  Transforms.setNodes(
    editor,
    { [format]: isActive ? null : true },
    { match: Text.isText, split: true }
  );
};

const isFormatActive = (editor, format) => {
  const [match] = Editor.nodes(editor, {
    match: (n) => n[format] === true,
    mode: "all",
  });
  return !!match;
};

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underlined) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};
export const Portal = ({ children }) => {
  return typeof document === "object"
    ? ReactDOM.createPortal(children, document.body)
    : null;
};
const HoveringToolbar = () => {
  const ref = useRef();
  const editor = useSlate();
  const inFocus = useFocused();

  useEffect(() => {
    const el = ref.current;
    const { selection } = editor;

    if (!el) {
      return;
    }

    if (!inFocus) {
      el.removeAttribute("style");
      return;
    }

    const domSelection = window.getSelection();
    const domRange = domSelection.getRangeAt(0);
    const rect = domRange.getBoundingClientRect();

    el.style.opacity = "1";
    el.style.top = `${rect.top + window.pageYOffset + 36}px`;
    el.style.left = `${Math.min(
      rect.left,
      window.innerWidth - el.offsetWidth - 20
    )}px`;
  });

  return (
    <Portal>
      <Box
        ref={ref}
        sx={{
          padding: "8px 7px 6px",
          position: "absolute",
          zIndex: 1,
          top: "-10000px",
          left: "-10000px",
          marginTop: "-6px",
          opacity: 0,
          display: "flex",
          backgroundColor: "#fafafa",
          borderRadius: "4px",
          boxShadow: "0 1px 5px rgba(0,0,0,.2)",
          transition: "opacity 0.75s",
        }}
        onMouseDown={(e) => {
          // prevent toolbar from taking focus away from editor
          e.preventDefault();
        }}
      >
        <InsertImageButton />
      </Box>
    </Portal>
  );
};

const FormatButton = ({ format, icon }) => {
  const editor = useSlate();
  return (
    <Button
      reversed
      active={isFormatActive(editor, format)}
      onClick={() => toggleFormat(editor, format)}
    >
      <Icon>{icon}</Icon>
    </Button>
  );
};

const isImageUrl = (url) => {
  if (!url) return false;
  if (!isUrl(url)) return false;
  const ext = new URL(url).pathname.split(".").pop();
  return imageExtensions.includes(ext);
};

export default SlateEditor;
