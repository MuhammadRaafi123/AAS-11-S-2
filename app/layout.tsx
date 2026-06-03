import "./globals.css";

export const metadata = {
  title: "Lapor Nih",
  description: "Platform Pengaduan Masyarakat",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0d1117] text-white">

        {/* Background */}
        <div className="fixed inset-0 -z-10 bg-[#0d1117]">

          {/* Gradient */}
          <div
            className="
              absolute inset-0
              bg-gradient-to-b
              from-blue-950/40
              via-[#0d1117]
              to-[#0d1117]
            "
          />

          {/* Grid */}
          <div
            className="
              absolute inset-0
              opacity-[0.06]
              [background-size:40px_40px]
              [background-image:
                linear-gradient(to_right,#3b82f6_1px,transparent_1px),
                linear-gradient(to_bottom,#3b82f6_1px,transparent_1px)
              ]
            "
          />

          {/* Glow */}
          <div
            className="
              absolute top-0 left-1/2
              -translate-x-1/2
              w-[600px] h-[300px]
              bg-blue-600/20
              blur-3xl
              rounded-full
            "
          />
        </div>

        {children}

      </body>
    </html>
  );
}