interface LogoProps {
  className?: string;
  large?: boolean;
}

export const Logo = ({ className = "", large = false }: LogoProps) => {
  return (
    <div className={`flex flex-col items-center leading-none select-none ${className}`}>
      <div className={`relative z-10 ${large ? 'text-6xl mb-2' : 'text-3xl'}`}>
        <span className="absolute -top-1 left-1/2 -translate-x-1/2 animate-pulse opacity-80">🔥</span>
        <span>🍔</span>
      </div>
      <h1
        className={`font-display tracking-wider ${large ? 'text-4xl' : 'text-2xl'}`}
        style={{
          textShadow: '2px 2px 0px #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
          color: 'hsl(45, 100%, 50%)'
        }}
      >
        KING BURGUER
      </h1>
    </div>
  );
};
