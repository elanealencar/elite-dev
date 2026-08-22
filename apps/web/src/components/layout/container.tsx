type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export function Container({
  children,
  className = "",
}: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full max-w-360 px-5 md:px-8 lg:px-12 ${className}`}
    >
      {children}
    </div>
  );
}