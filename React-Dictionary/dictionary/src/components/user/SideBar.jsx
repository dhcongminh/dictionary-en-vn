import React from "react";
import "../../styles/sidebar.css";
import SupervisedUserCircleOutlinedIcon from '@mui/icons-material/SupervisedUserCircleOutlined';
import PlaylistAddCheckCircleOutlinedIcon from '@mui/icons-material/PlaylistAddCheckCircleOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import { useLocation, useNavigate } from "react-router-dom";
import { Divider } from "@mui/material";
import Swal from "sweetalert2";

const Sidebar = ({isSideBarShow, setIsSideBarShow}) => {
    const location = useLocation();
    const nav = useNavigate();
    
    const handleClose = () => {
        setIsSideBarShow(false);
    }
    const handlePendingWordsListClick = () => {
        Swal.fire({
            icon: "info",
            title: "Coming soon",
            html: "Bạn vui lòng vào danh sách tất cả các từ </br>Sau đó sử dụng bộ lọc để lọc ra các từ có trạng thái <span className='text-warning'>pending<span>"
        })
    }
    const handleUsersManagement = () => {
        Swal.fire({
            icon: "info",
            title: "Coming soon"
        })
    }
    return (
        <div>
            <div onClick={handleClose} className={isSideBarShow ? "overlay show" : "overlay"}></div>
            <div className={isSideBarShow ? "sidebar show" : "sidebar"}>
                <div
                    className="contentsContainer"
                >
                    <ul>
                        <li onClick={() => nav("/admin/grossaries")} className={location.pathname === "/admin/grossaries" ? "active" : ""}>
                            <ListAltOutlinedIcon sx={{width: 50, height: 50}}/>
                            <div >Tất cả từ vựng</div>
                        </li>
                        <Divider />
                        <li onClick={() => handlePendingWordsListClick()} className={location.pathname === "/admin/pending-words" ? "active" : "" } >
                            <PlaylistAddCheckCircleOutlinedIcon sx={{width: 50, height: 50}}/>
                            <div >Các từ cần kiểm duyệt</div>
                        </li>
                        <Divider />
                        <li onClick={() => handleUsersManagement()} className={location.pathname === "/admin/users" ? "active" : "" } >
                            <SupervisedUserCircleOutlinedIcon sx={{width: 50, height: 50}} />
                            <div >Quản lý người dùng</div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        
    );
};

export default Sidebar;