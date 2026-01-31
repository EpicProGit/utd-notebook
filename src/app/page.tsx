import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

import { BaseHeader } from "@src/components/header/BaseHeader";
import NebulaLogo from "@src/icons/NebulaLogo";

export default function Home() {
  return (
    <main className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0 z-0 bg-[linear-gradient(106deg,#C0C2FF_13.64%,#DDBBF3_48.08%,#FFC6C1_83.43%)]" />
      <div className="absolute inset-0 z-10 dark:bg-black/40" />

      <div className="relative z-30">
        <BaseHeader
          shadow
          transparent
          disableSticky
          color="light"
          itemVisibility={{
            menu: true,
            logo: true,
            children: false,
            account: true,
          }}
        />
      </div>

      <section className="relative z-20 flex h-full items-center justify-center px-4">
        <div className="flex flex-col items-center text-center translate-y-[-2%]">
          <h2 className="mb-3 flex items-center gap-1 text-sm font-semibold tracking-wider text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.45)]">
            <span>POWERED BY</span>
            <a
              href="https://www.utdnebula.com/"
              target="_blank"
              rel="noopener"
              className="flex items-center gap-1"
            >
              <NebulaLogo className="font-display h-4 w-auto fill-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.45)]" />
              <span>NEBULA LABS</span>
            </a>
          </h2>

          <h1 className="font-display mb-4 max-w-3xl px-5 text-center text-3xl font-semibold text-white md:px-0 md:text-6xl drop-shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
            UTD NOTEBOOK
          </h1>

          <p className="font-display mb-10 max-w-2xl text-white text-base md:text-lg drop-shadow-[0_4px_16px_rgba(0,0,0,0.45)]">
            Share and access course notes. By students, for students.
          </p>

          <div
            className={[
              "w-full max-w-[600px]",
              "[&_.MuiInputBase-root]:bg-white/70",
              "dark:[&_.MuiInputBase-root]:bg-black/55",
              "[&_.MuiOutlinedInput-root]:rounded-full",
              "[&_.MuiOutlinedInput-notchedOutline]:rounded-full",
              "[&_.MuiOutlinedInput-notchedOutline]:border-transparent",
              "[&_.MuiOutlinedInput-notchedOutline]:border-[3px]",
              "hover:[&_.MuiOutlinedInput-notchedOutline]:border-[#7C60BF]",
              "focus-within:[&_.MuiOutlinedInput-notchedOutline]:border-[#7C60BF]",
              "[&_.MuiInputBase-input]:text-[#7C60BF]",
              "dark:[&_.MuiInputBase-input]:text-white",
              "[&_.MuiInputBase-input::placeholder]:text-[#7C60BF]/80",
              "dark:[&_.MuiInputBase-input::placeholder]:text-white/70",
              "drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)]",
            ].join(" ")}
          >
            <TextField
              fullWidth
              placeholder="Search for courses or professors"
              variant="outlined"
              slotProps={{
                input: {
                  endAdornment: [
                    <InputAdornment position="end" key="search-icon">
                      <SearchIcon sx={{ color: "#AC99DB" }} />
                    </InputAdornment>,
                  ],
                },
              }}
              sx={{
                "& .MuiInputBase-input": {
                  paddingY: "14px",
                  fontWeight: 500,
                },
              }}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
