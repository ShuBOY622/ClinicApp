package com.clinic.service;

import com.clinic.dto.MedicineDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface MedicineService {
    MedicineDTO createMedicine(MedicineDTO medicineDTO);
    MedicineDTO updateMedicine(Long id, MedicineDTO medicineDTO);
    MedicineDTO getMedicineById(Long id);
    void deleteMedicine(Long id);
    Page<MedicineDTO> getAllMedicines(Pageable pageable);
    Page<MedicineDTO> searchMedicines(String keyword, Pageable pageable);
}
