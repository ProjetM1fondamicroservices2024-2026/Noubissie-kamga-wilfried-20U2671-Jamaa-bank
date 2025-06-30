package com.jamaa.service_users.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class S3StorageService implements StorageService {

    private static final Logger logger = LoggerFactory.getLogger(S3StorageService.class);

    private static final String UPLOAD_DIR = "uploads/cni";

    
    @Override
    public String save(MultipartFile file) throws IOException {
        logger.info("📤 Début de l'enregistrement local...");
        // Validation du fichier
        if (file == null || file.isEmpty()) {
            logger.error("❌ Le fichier est null ou vide");
            throw new IOException("Le fichier est null ou vide");
        }
        logger.info("📋 Informations du fichier:");
        logger.info("   📄 Nom original: {}", file.getOriginalFilename());
        logger.info("   📏 Taille: {} bytes", file.getSize());
        logger.info("   🎭 Type MIME: {}", file.getContentType());

        // Créer le dossier s’il n’existe pas
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (Files.notExists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Générer un nom de fichier unique
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String newFileName = UUID.randomUUID() + extension;
        Path filePath = uploadPath.resolve(newFileName);

        // Sauvegarder le fichier
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        logger.info("✅ Fichier enregistré localement à : {}", filePath.toString());

        // Retourner le chemin relatif
        return "/" + UPLOAD_DIR + "/" + newFileName;
    }

}