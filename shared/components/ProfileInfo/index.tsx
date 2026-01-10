'use client';
import React from "react";
import './styles.scss'
import Image from "next/image";
import useStudent from "@/shared/hooks/useStudent";

const ProfileInfo = () => {
    const studentState = useStudent()
    console.log("ProfileInfo state ->", studentState);
    const student = studentState?.data || {};

    console.log("ProfileInfo student -==================>", student);

    return (
        <div className="profile-header-section">
            <div className="img-container">
                <Image src="/assets/man.png" height={100} width={100} alt="Profile image" />
            </div>
            <div className="name-container">
                <h2>{student?.name}</h2>
                <p>{student?.email}</p>
            </div>
        </div>
    );
};

export default ProfileInfo;
