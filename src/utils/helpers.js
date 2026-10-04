// Format a date object
export const formatDate = (date) => {
  if (!date) return '';
  const d = date?.toDate ? date.toDate() : new Date(date);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

// Format time
export const formatTime = (date) => {
  if (!date) return '';
  const d = date?.toDate ? date.toDate() : new Date(date);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

// Countdown timer
export const getCountdown = (targetDate) => {
  const now = new Date().getTime();
  const diff = targetDate.getTime() - now;
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
    expired: false,
  };
};

// Export teams to CSV
export const exportToCSV = (teams) => {
  const headers = [
    'Registration ID', 'Team Name', 'Category', 'City/School', 'Status',
    'Captain Name', 'Captain Phone', 'Captain Email',
    'Coach Name', 'Coach Phone',
    'Payment Method', 'Transaction ID', 'Payment Status',
    'Registered At',
  ];
  const rows = teams.map(t => [
    t.registrationId,
    t.teamName,
    t.category,
    t.city,
    t.status,
    t.captain?.name,
    t.captain?.phone,
    t.captain?.email,
    t.coach?.name,
    t.coach?.phone,
    t.payment?.method,
    t.payment?.transactionId,
    t.payment?.status,
    formatDate(t.createdAt),
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(v => `"${v ?? ''}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `husler-cup-teams-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

// Validate image file
export const validateImageFile = (file) => {
  if (!file) return 'File is required';
  if (!file.type.startsWith('image/')) return 'Only image files are allowed';
  if (file.size > 5 * 1024 * 1024) return 'File must be under 5 MB';
  return null;
};

// Truncate text
export const truncate = (str, n = 30) =>
  str?.length > n ? str.slice(0, n) + '...' : str;

// Compress an image file to Base64 (max width/height 800px, JPEG 0.7)
// This ensures images can be safely saved directly to Firestore if Firebase Storage is blocked or slow
export const compressImageToBase64 = (file, maxWidth = 800, maxHeight = 800, quality = 0.7) => {
  return new Promise((resolve) => {
    if (!file) {
      resolve('');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target.result);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => resolve('');
      img.src = e.target.result;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
};

