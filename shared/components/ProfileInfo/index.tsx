'use client';
import React from "react";
import './styles.scss'
import Image from "next/image"; 

const ProfileInfo = ({user}) => { 

    return (
        <div className="profile-header-section">
            <div className="img-container">
                <Image src="/assets/man.png" height={100} width={100} alt="Profile image" />
            </div>
            <div className="name-container">
                <h2>{user?.name}</h2>
                <p>{user?.email}</p>
            </div>
        </div>
    );
};

export default ProfileInfo;
