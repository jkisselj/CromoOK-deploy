import { useAuthContext } from "../../hooks/useAuthContext";

export interface IPublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FunctionComponent<IPublicRouteProps> = ({
  children,
}) => {
  const { loading } = useAuthContext();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  // Убираем проверку на user и перенаправление
  return <>{children}</>;
};

export default PublicRoute;