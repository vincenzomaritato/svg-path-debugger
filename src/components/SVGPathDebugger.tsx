import { useState, useEffect, useCallback, useRef } from "react";
import "./SVGPathDebugger.css";

/**
 * Represents a single SVG path command with its parameters and description
 */
interface PathCommand {
  type: string;
  params: number[];
  description: string;
}

/**
 * SVG Path Debugger Component
 *
 * A tool for visualizing and debugging SVG paths in real-time.
 * Features:
 * - Real-time path visualization
 * - Command breakdown
 * - Error detection
 */
const SVGPathDebugger = () => {
  // State management
  const [pathData, setPathData] = useState<string>("M10 10 L90 90");
  const [commands, setCommands] = useState<PathCommand[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [strokeColor, setStrokeColor] = useState<string>("#000000");
  const [strokeWidth, setStrokeWidth] = useState<number>(1);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [selectedCommand, setSelectedCommand] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [viewBox, setViewBox] = useState<string>("0 0 100 100");

  /**
   * Parses SVG path data into an array of commands
   * @param data - The SVG path data string
   * @returns Array of parsed path commands
   */
  const parsePathData = useCallback((data: string): PathCommand[] => {
    const commands: PathCommand[] = [];
    const commandRegex = /([MLHVCSQTAZmlhvcsqtaz])([^MLHVCSQTAZmlhvcsqtaz]*)/g;
    let match;

    while ((match = commandRegex.exec(data)) !== null) {
      const [_, type, paramsStr] = match;
      const params = paramsStr
        .trim()
        .split(/[\s,]+/)
        .map(Number);

      let description = "";
      switch (type.toUpperCase()) {
        case "M":
          description = "Move to";
          break;
        case "L":
          description = "Line to";
          break;
        case "H":
          description = "Horizontal line to";
          break;
        case "V":
          description = "Vertical line to";
          break;
        case "C":
          description = "Cubic Bézier curve";
          break;
        case "S":
          description = "Smooth cubic Bézier curve";
          break;
        case "Q":
          description = "Quadratic Bézier curve";
          break;
        case "T":
          description = "Smooth quadratic Bézier curve";
          break;
        case "A":
          description = "Elliptical arc";
          break;
        case "Z":
          description = "Close path";
          break;
      }

      commands.push({ type, params, description });
    }

    return commands;
  }, []);

  // Parse path data when it changes
  useEffect(() => {
    try {
      const parsedCommands = parsePathData(pathData);
      setCommands(parsedCommands);
      setError(null);
    } catch (err) {
      setError("Invalid path data");
    }
  }, [pathData, parsePathData]);

  /**
   * Calculates the appropriate viewBox for the SVG based on the path data
   */
  const calculateViewBox = useCallback((pathData: string) => {
    try {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      path.setAttribute("d", pathData);
      svg.appendChild(path);
      document.body.appendChild(svg);

      const bbox = path.getBBox();
      document.body.removeChild(svg);

      // Add some padding around the path
      const padding = 10;
      const x = Math.floor(bbox.x - padding);
      const y = Math.floor(bbox.y - padding);
      const width = Math.ceil(bbox.width + padding * 2);
      const height = Math.ceil(bbox.height + padding * 2);

      // If the path is too small, use default viewBox
      if (width < 10 || height < 10) {
        return "0 0 100 100";
      }

      return `${x} ${y} ${width} ${height}`;
    } catch (err) {
      return "0 0 100 100";
    }
  }, []);

  // Update viewBox when path data changes
  useEffect(() => {
    if (pathData) {
      const newViewBox = calculateViewBox(pathData);
      setViewBox(newViewBox);
    }
  }, [pathData, calculateViewBox]);

  const handleCopyPath = () => {
    navigator.clipboard.writeText(pathData);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleCommandClick = (index: number) => {
    setSelectedCommand(index === selectedCommand ? null : index);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setStrokeColor(newColor);
  };

  const handleColorPreviewClick = () => {
    const colorInput = document.getElementById(
      "stroke-color"
    ) as HTMLInputElement;
    if (colorInput) {
      colorInput.click();
    }
  };

  // Add effect to monitor color changes
  useEffect(() => {
    console.log("Stroke color updated:", strokeColor);
  }, [strokeColor]);

  const handleStrokeWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setStrokeWidth(value);
  };

  return (
    <div className="svg-path-debugger">
      <div className="controls">
        <div className="input-group">
          <div className="input-header">
            <label htmlFor="path-input">SVG Path Data</label>
            <button
              className="copy-button"
              onClick={handleCopyPath}
              aria-label="Copy path data"
            >
              {isCopied ? "Copied!" : "Copy"}
            </button>
          </div>
          <textarea
            id="path-input"
            value={pathData}
            onChange={(e) => setPathData(e.target.value)}
            placeholder="Enter SVG path data (e.g., M10 10 L90 90)"
            className="path-input"
            aria-label="SVG Path Data"
          />
          {error && (
            <div className="error" role="alert">
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                className="error-icon"
              >
                <path
                  fill="currentColor"
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
                />
              </svg>
              {error}
            </div>
          )}
        </div>

        <div className="preview-controls">
          <div className="style-controls">
            <label>
              <span>Stroke Color</span>
              <div className="color-control">
                <div
                  className="color-preview"
                  style={{ backgroundColor: strokeColor }}
                  onClick={handleColorPreviewClick}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleColorPreviewClick();
                    }
                  }}
                />
                <input
                  id="stroke-color"
                  type="color"
                  value={strokeColor}
                  onChange={handleColorChange}
                  aria-label="Stroke color"
                  style={{
                    visibility: "hidden",
                    width: 0,
                    height: 0,
                    position: "absolute",
                  }}
                />
              </div>
            </label>
            <label>
              <span>Stroke Width</span>
              <div className="range-container">
                <input
                  type="range"
                  min="0.5"
                  max="5"
                  step="0.1"
                  value={strokeWidth}
                  onChange={handleStrokeWidthChange}
                  aria-label="Stroke width"
                />
                <span className="range-value">{strokeWidth.toFixed(1)}px</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className="preview">
        <svg
          ref={svgRef}
          width="400"
          height="400"
          viewBox={viewBox}
          aria-label="SVG Path Preview"
          preserveAspectRatio="xMidYMid meet"
        >
          <path
            d={pathData}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            className={selectedCommand !== null ? "path-highlight" : ""}
            style={{ transition: "stroke 0.1s ease" }}
          />
        </svg>
      </div>

      <div className="commands">
        <div className="commands-header">
          <h3>Path Commands</h3>
          <span className="command-count">{commands.length} commands</span>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Command</th>
                <th>Parameters</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {commands.map((cmd, index) => (
                <tr
                  key={index}
                  className={selectedCommand === index ? "selected" : ""}
                  onClick={() => handleCommandClick(index)}
                >
                  <td>
                    <code>{cmd.type}</code>
                  </td>
                  <td>
                    <code>{cmd.params.join(" ")}</code>
                  </td>
                  <td>{cmd.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SVGPathDebugger;
