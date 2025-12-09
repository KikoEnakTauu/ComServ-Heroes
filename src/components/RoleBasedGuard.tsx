// src/components/RoleBasedGuard.tsx
import { View, Text } from "react-native";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../types/auth";

interface RoleBasedGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallback?: React.ReactNode; // Optional custom unauthorized view
}

export const RoleBasedGuard: React.FC<RoleBasedGuardProps> = ({
  children,
  allowedRoles,
  fallback,
}) => {
  const { user, hasRole } = useAuth();

  if (!user || !hasRole(allowedRoles)) {
    // Default Unauthorized View
    return (
      fallback || (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: "red", fontWeight: "bold" }}>
            ⛔ Access Denied: Requires {allowedRoles.join(" or ")} role.
          </Text>
        </View>
      )
    );
  }

  return <>{children}</>;
};
