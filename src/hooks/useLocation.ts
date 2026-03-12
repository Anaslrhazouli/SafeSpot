import { useState, useCallback, useEffect } from "react";
import * as locationService from "@/services/locationService";

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  loading: boolean;
  error: string | null;
  permissionStatus: string | null;
}

export function useLocation() {
  const [state, setState] = useState<LocationState>({
    latitude: null,
    longitude: null,
    loading: false,
    error: null,
    permissionStatus: null,
  });

  const checkPermission = useCallback(async () => {
    const status = await locationService.getPermissionStatus();
    setState((prev) => ({ ...prev, permissionStatus: status }));
    return status;
  }, []);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  const getCurrentPosition = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const coords = await locationService.getCurrentPosition();
      if (!coords) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: "Location permission denied",
          permissionStatus: "denied",
        }));
        return null;
      }
      setState({
        latitude: coords.latitude,
        longitude: coords.longitude,
        loading: false,
        error: null,
        permissionStatus: "granted",
      });
      return coords;
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err.message ?? "Failed to get location",
      }));
      return null;
    }
  }, []);

  return { ...state, getCurrentPosition, checkPermission };
}
