import React from 'react';
import { UserRole } from '../../../models/userStore';
import './user-mode-switch.component.css'

interface UserModeSwitchProps {
    userRole: UserRole 
}

function UserModeSwitch({ userRole }: UserModeSwitchProps) {
  
  return (
    <div>UserModeSwitch</div>
  )
}

export default UserModeSwitch;