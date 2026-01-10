'use client';
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getToken } from "../utils/cookies";
import { setStudent, updateStudentProgress } from "../store/student/reducer";

const useStudent = () => {
    const studentState = useSelector((state) => state.student);
    const dispatch = useDispatch();

    useEffect(() => {
        checkStudentLogin()
    }, []);

    const checkStudentLogin = async () => {
        const token = getToken()
        if (!token || studentState?.progressing || studentState?.data) {
            return
        }
        dispatch(updateStudentProgress(true));
        try {
            const response = await fetch("/api/students/check-signin", {
                method: "GET",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            });
            const { data } = await response.json();
            console.log("check signin data ----->>", data)
            if (!data) {
                throw new Error(message || "Signin failed");
            }
            dispatch(setStudent(data));

        } catch (error) {

        } finally {
            dispatch(updateStudentProgress(false));
        }
    }
    return studentState;
};

export default useStudent;
