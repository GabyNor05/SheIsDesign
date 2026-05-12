import {useState} from "react";
import {MagnifyingGlass} from "@phosphor-icons/react";
import { T } from "../theme";

function Searchbar(){
    const [search,  setSearch]  = useState("");
    return(
        <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                  <MagnifyingGlass size={14} color={T.textMuted} />
                </span>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search events..."
                  aria-label="Search events"
                  style={{
                    background: T.surface, border: `1px solid ${T.border}`,
                    borderRadius: 9, padding: "10px 14px 10px 36px",
                    color: T.textPrimary, fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13.5, outline: "none", width: 220, transition: "border-color .15s",
                  }}
                  onFocus={e => { e.target.style.borderColor = T.pink; }}
                  onBlur={e  => { e.target.style.borderColor = T.border; }}
                />
              </div>
    );
}

export default Searchbar;