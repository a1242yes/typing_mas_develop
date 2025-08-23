export default function KeyButton2(props: any) {
  return (
    <button
      style={{
        width: props.width || "0px",
        height: "65px",
        backgroundColor: props.backgroundColor,
        fontSize: "15px",
        borderRadius: "6px",
        border: "1px solid #000000",
        marginRight: props.marginRight || "0px",
      }}
    >
      <a
        style={{ textDecoration: "none", color: props.labelColor || "#FFFFFF" }}
      >
        {props.label}
      </a>
    </button>
  );
}
