import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../redux/userSlice";
import Cookies from "js-cookie";

export default function IsCookiePresent() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.currentUser);
  const token = Cookies.get("token");
  useEffect(() => {
    if (!token && currentUser) {
      dispatch(signOut());
    }
  }, [token, currentUser, dispatch]);
}
