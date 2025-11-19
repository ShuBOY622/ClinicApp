package com.clinic.service;

import com.clinic.dto.AuthRequest;
import com.clinic.dto.AuthResponse;

public interface AuthService {
    AuthResponse login(AuthRequest request);
    AuthResponse register(AuthRequest request);
}
