import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AbsenceDetail } from '../../models/absence.model';

export interface FileInfo {
  fileName: string;
  fileType: 'pdf' | 'image' | 'doc' | 'other';
  extension: string;
  isAccessible: boolean;
  signedUrl?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SupabaseFileServiceService {
  private readonly supabase: SupabaseClient = createClient(
    'https://hxtdyxlhxmecheddfedt.supabase.co', // Your Supabase URL
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4dGR5eGxoeG1lY2hlZGRmZWR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5Njg0MzYsImV4cCI6MjA2NDU0NDQzNn0.CVXC7Qjl2Xlfmy4YVHYsN4ItKnjE6YA5mTuEEJ5o8WQ' // Your Supabase Anon Key
  );

  private readonly BUCKET_NAME = 'justifications';

  error: string | null = null;

  getFileName(url: string): string {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const fileName = pathname.split('/').pop() ?? 'document';
      return decodeURIComponent(fileName);
    } catch {
      return 'Document';
    }
  }

  getFileExtension(url: string): string {
    const fileName = this.getFileName(url);
    const lastDot = fileName.lastIndexOf('.');
    return lastDot !== -1 ? fileName.substring(lastDot + 1) : '';
  }

  getFileType(url: string): 'pdf' | 'image' | 'doc' | 'other' {
    const extension = this.getFileExtension(url).toLowerCase();

    if (extension === 'pdf') {
      return 'pdf';
    } else if (
      ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)
    ) {
      return 'image';
    } else if (['doc', 'docx'].includes(extension)) {
      return 'doc';
    } else {
      return 'other';
    }
  }

  /**
   * Helper to extract file path from a full Supabase public URL
   * Example: 'justifications/7/1749776656016_Liste_des_Taches.pdf'
   */
  private getFilePathFromUrl(fullUrl: string): string | null {
    try {
      const urlObj = new URL(fullUrl);
      const pathSegments = urlObj.pathname
        .split('/')
        .filter((segment) => segment);

      // Expected format: /storage/v1/object/public/[bucket]/[file_path]
      if (
        pathSegments.length >= 5 &&
        pathSegments[0] === 'storage' &&
        pathSegments[1] === 'v1' &&
        pathSegments[2] === 'object' &&
        pathSegments[3] === 'public' &&
        pathSegments[4] === this.BUCKET_NAME // Ensure it's for the correct bucket
      ) {
        return pathSegments.slice(5).join('/'); // Get everything after 'public/justifications/'
      }
      return null;
    } catch (e) {
      console.error('Error parsing file URL:', e);
      return null;
    }
  }

  /**
   * Visualiser une pièce jointe dans une nouvelle fenêtre
   * Now generates a signed URL before opening.
   */
  async viewAttachment(
    url: string,
    index: number,
    downloadingFiles: boolean[]
  ): Promise<void> {
    this.error = null; // Clear previous errors
    const filePath = this.getFilePathFromUrl(url);

    if (!filePath) {
      this.error = 'URL de fichier invalide ou chemin introuvable.';
      console.error('Invalid file URL for signed URL generation:', url);
      return;
    }

    try {
      // Generate a signed URL valid for 1 hour (3600 seconds)
      const { data, error } = await this.supabase.storage
        .from(this.BUCKET_NAME)
        .createSignedUrl(filePath, 3600);

      if (error) {
        throw new Error(error.message);
      }
      if (!data?.signedUrl) {
        throw new Error('Signed URL not returned.');
      }

      const newWindow = window.open(data.signedUrl, '_blank');

      if (!newWindow) {
        // If popup is blocked, attempt to download
        console.warn('Popup bloqué, tentative de téléchargement...');
        this.downloadAttachment(url, index, downloadingFiles); // Still use the original URL to get filepath for download
      }
    } catch (error: any) {
      console.error(
        "Erreur lors de la visualisation ou de l'obtention de l'URL signée:",
        error
      );
      this.error = `Impossible d'ouvrir le fichier: ${
        error.message ?? 'Erreur inconnue'
      }`;
    }
  }

  /**
   * Télécharger une pièce jointe spécifique
   * Now generates a signed URL before fetching for download.
   */
  async downloadAttachment(
    url: string,
    index: number,
    downloadingFiles: boolean[]
  ): Promise<void> {
    if (downloadingFiles[index]) return;

    downloadingFiles[index] = true;
    this.error = null; // Clear previous errors
    const filePath = this.getFilePathFromUrl(url);

    if (!filePath) {
      this.error =
        'URL de fichier invalide ou chemin introuvable pour le téléchargement.';
      console.error(
        'Invalid file URL for signed URL generation (download):',
        url
      );
      downloadingFiles[index] = false;
      return;
    }

    try {
      // Generate a signed URL for download
      const { data, error } = await this.supabase.storage
        .from(this.BUCKET_NAME)
        .createSignedUrl(filePath, 3600); // Valid for 1 hour

      if (error) {
        throw new Error(error.message);
      }
      if (!data?.signedUrl) {
        throw new Error('Signed URL not returned for download.');
      }

      const response = await fetch(data.signedUrl);
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const blob = await response.blob();
      const fileName = this.getFileName(url);

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(downloadUrl);
    } catch (error: any) {
      console.error('Erreur lors du téléchargement:', error);
      this.error = `Erreur lors du téléchargement du fichier: ${
        error.message ?? 'Erreur inconnue'
      }`;
    } finally {
      downloadingFiles[index] = false;
    }
  }

  async downloadAllAttachments(
    absenceDetail: AbsenceDetail | null,
    isDownloading: boolean
  ): Promise<void> {
    if (!absenceDetail?.justification?.piecesJointes?.length || isDownloading) {
      return;
    }

    isDownloading = true;
    let successCount = 0;
    let errorCount = 0;
    this.error = null; // Clear previous errors

    try {
      const downloadPromises = absenceDetail.justification.piecesJointes.map(
        async (url, index) => {
          const filePath = this.getFilePathFromUrl(url);
          if (!filePath) {
            console.error(
              `Invalid file URL for download all (index ${index}):`,
              url
            );
            errorCount++;
            return; // Skip this file
          }

          try {
            const { data, error } = await this.supabase.storage
              .from(this.BUCKET_NAME)
              .createSignedUrl(filePath, 3600); // Valid for 1 hour

            if (error) {
              throw new Error(error.message);
            }
            if (!data?.signedUrl) {
              throw new Error('Signed URL not returned.');
            }

            const response = await fetch(data.signedUrl);
            if (!response.ok) {
              throw new Error(`Erreur HTTP: ${response.status}`);
            }

            const blob = await response.blob();
            const fileName = this.getFileName(url);

            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `${index + 1}_${fileName}`;

            // Add a slight delay to avoid overwhelming the browser with multiple downloads
            await new Promise((resolve) => setTimeout(resolve, index * 200));

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            window.URL.revokeObjectURL(downloadUrl);

            successCount++;
          } catch (error) {
            console.error(`Erreur téléchargement fichier ${index + 1}:`, error);
            errorCount++;
          }
        }
      );

      await Promise.all(downloadPromises);

      if (errorCount === 0) {
        console.log(`${successCount} fichiers téléchargés avec succès`);
      } else {
        console.warn(
          `${successCount} fichiers téléchargés, ${errorCount} erreurs`
        );
        this.error = `Téléchargement partiel: ${errorCount} erreur(s) sur ${absenceDetail.justification.piecesJointes.length} fichiers`;
      }
    } catch (error) {
      console.error('Erreur lors du téléchargement groupé:', error);
      this.error = 'Erreur lors du téléchargement des fichiers';
    } finally {
      isDownloading = false;
    }
  }
}
