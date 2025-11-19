package com.clinic.service.impl;

import com.clinic.dto.MedicineDTO;
import com.clinic.exception.ResourceNotFoundException;
import com.clinic.model.Medicine;
import com.clinic.repository.MedicineRepository;
import com.clinic.service.MedicineService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MedicineServiceImpl implements MedicineService {

    private final MedicineRepository medicineRepository;

    @Override
    @Transactional
    public MedicineDTO createMedicine(MedicineDTO medicineDTO) {
        Medicine medicine = mapToEntity(medicineDTO);
        Medicine savedMedicine = medicineRepository.save(medicine);
        return mapToDTO(savedMedicine);
    }

    @Override
    @Transactional
    public MedicineDTO updateMedicine(Long id, MedicineDTO medicineDTO) {
        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medicine not found with id: " + id));
        
        medicine.setName(medicineDTO.getName());
        medicine.setGenericName(medicineDTO.getGenericName());
        medicine.setCategory(medicineDTO.getCategory());
        medicine.setFormType(medicineDTO.getFormType());
        medicine.setDosage(medicineDTO.getDosage());
        medicine.setManufacturer(medicineDTO.getManufacturer());
        medicine.setPrice(medicineDTO.getPrice());
        medicine.setStockQuantity(medicineDTO.getStockQuantity());
        medicine.setExpiryDate(medicineDTO.getExpiryDate());

        Medicine updatedMedicine = medicineRepository.save(medicine);
        return mapToDTO(updatedMedicine);
    }

    @Override
    @Transactional(readOnly = true)
    public MedicineDTO getMedicineById(Long id) {
        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medicine not found with id: " + id));
        return mapToDTO(medicine);
    }

    @Override
    @Transactional
    public void deleteMedicine(Long id) {
        if (!medicineRepository.existsById(id)) {
            throw new ResourceNotFoundException("Medicine not found with id: " + id);
        }
        medicineRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<MedicineDTO> getAllMedicines(Pageable pageable) {
        return medicineRepository.findAll(pageable).map(this::mapToDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<MedicineDTO> searchMedicines(String keyword, Pageable pageable) {
        return medicineRepository.searchMedicines(keyword, pageable).map(this::mapToDTO);
    }

    private MedicineDTO mapToDTO(Medicine medicine) {
        MedicineDTO dto = new MedicineDTO();
        dto.setId(medicine.getId());
        dto.setName(medicine.getName());
        dto.setGenericName(medicine.getGenericName());
        dto.setCategory(medicine.getCategory());
        dto.setFormType(medicine.getFormType());
        dto.setDosage(medicine.getDosage());
        dto.setManufacturer(medicine.getManufacturer());
        dto.setPrice(medicine.getPrice());
        dto.setStockQuantity(medicine.getStockQuantity());
        dto.setExpiryDate(medicine.getExpiryDate());
        return dto;
    }

    private Medicine mapToEntity(MedicineDTO dto) {
        Medicine medicine = new Medicine();
        medicine.setName(dto.getName());
        medicine.setGenericName(dto.getGenericName());
        medicine.setCategory(dto.getCategory());
        medicine.setFormType(dto.getFormType());
        medicine.setDosage(dto.getDosage());
        medicine.setManufacturer(dto.getManufacturer());
        medicine.setPrice(dto.getPrice());
        medicine.setStockQuantity(dto.getStockQuantity());
        medicine.setExpiryDate(dto.getExpiryDate());
        return medicine;
    }
}
