document.addEventListener('DOMContentLoaded', function() {
    // Inisialisasi data
    if (!localStorage.getItem('passwords')) {
        const initialPasswords = [
            { password: 'AX9B7C', used: false },
            { password: 'DY3E8F', used: false },
            { password: 'GH6J2K', used: false }
        ];
        localStorage.setItem('passwords', JSON.stringify(initialPasswords));
    }
    
    if (!localStorage.getItem('usedPasswords')) {
        localStorage.setItem('usedPasswords', JSON.stringify([]));
    }
    
    // Cek jika sudah login
    if (localStorage.getItem('isLoggedIn') === 'true') {
        showDashboard();
    }
    
    // Update daftar password
    updatePasswordList();
    
    // Event listener untuk tombol login
    document.getElementById('loginBtn').addEventListener('click', function() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (!username || !password) {
            showMessage('Username dan password harus diisi', 'error');
            return;
        }
        
        // Simulasi login
        authenticateUser(username, password);
    });
    
    // Event listener untuk tombol generate password
    document.getElementById('generateBtn').addEventListener('click', function() {
        generateNewPassword();
    });
    
    // Event listener untuk tombol logout
    document.getElementById('logoutBtn').addEventListener('click', function() {
        localStorage.setItem('isLoggedIn', 'false');
        document.getElementById('loginSection').classList.remove('fade-out');
        document.getElementById('dashboardSection').classList.remove('fade-in');
        document.getElementById('loginSection').style.display = 'block';
        document.getElementById('dashboardSection').style.display = 'none';
        
        // Reset form
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    });
    
    // Event listener untuk tombol tambah nomor
    document.getElementById('addNumberBtn').addEventListener('click', function() {
        addNumberToDatabase();
    });
    
    // Fungsi autentikasi
    function authenticateUser(username, password) {
        const passwords = JSON.parse(localStorage.getItem('passwords'));
        const usedPasswords = JSON.parse(localStorage.getItem('usedPasswords'));
        
        // Cek jika password sudah pernah digunakan
        if (usedPasswords.includes(password)) {
            showMessage('Password sudah pernah digunakan', 'error');
            return;
        }
        
        // Cek jika password valid
        const validPassword = passwords.find(p => p.password === password && !p.used);
        
        if (validPassword) {
            // Tandai password sebagai digunakan
            validPassword.used = true;
            localStorage.setItem('passwords', JSON.stringify(passwords));
            
            // Tambahkan ke daftar password yang sudah digunakan
            usedPasswords.push(password);
            localStorage.setItem('usedPasswords', JSON.stringify(usedPasswords));
            
            // Set status login
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', username);
            
            showMessage('Login berhasil! Mengarahkan ke dashboard...', 'success');
            
            // Tampilkan dashboard setelah delay
            setTimeout(showDashboard, 1500);
        } else {
            showMessage('Password tidak valid atau sudah digunakan', 'error');
        }
    }
    
    // Fungsi untuk menampilkan dashboard
    function showDashboard() {
        document.getElementById('loginSection').classList.add('fade-out');
        
        setTimeout(function() {
            document.getElementById('loginSection').style.display = 'none';
            document.getElementById('dashboardSection').style.display = 'block';
            document.getElementById('userName').textContent = localStorage.getItem('currentUser') || 'Pengguna';
            
            setTimeout(function() {
                document.getElementById('dashboardSection').classList.add('fade-in');
            }, 50);
        }, 600);
    }
    
    // Fungsi untuk menampilkan pesan
    function showMessage(text, type) {
        const messageEl = document.getElementById('message');
        messageEl.textContent = text;
        messageEl.className = 'message';
        messageEl.classList.add(type, 'show-message');
        
        // Sembunyikan pesan setelah 5 detik
        setTimeout(function() {
            messageEl.classList.remove('show-message');
        }, 5000);
    }
    
    // Fungsi untuk menampilkan pesan database
    function showDbMessage(text, type) {
        const messageEl = document.getElementById('dbMessage');
        messageEl.textContent = text;
        messageEl.className = 'message';
        messageEl.classList.add(type, 'show-message');
        
        // Sembunyikan pesan setelah 5 detik
        setTimeout(function() {
            messageEl.classList.remove('show-message');
        }, 5000);
    }
    
    // Fungsi untuk generate password baru
    function generateNewPassword() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let newPassword = '';
        
        for (let i = 0; i < 6; i++) {
            newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        const passwords = JSON.parse(localStorage.getItem('passwords'));
        passwords.push({ password: newPassword, used: false });
        localStorage.setItem('passwords', JSON.stringify(passwords));
        
        updatePasswordList();
        showMessage(`Password baru berhasil dibuat: ${newPassword}`, 'success');
    }
    
    // Fungsi untuk update daftar password
    function updatePasswordList() {
        const passwords = JSON.parse(localStorage.getItem('passwords'));
        const passwordListEl = document.getElementById('passwordList');
        
        passwordListEl.innerHTML = '';
        
        passwords.forEach(p => {
            const passwordItem = document.createElement('div');
            passwordItem.className = 'password-item';
            
            const passwordText = document.createElement('span');
            passwordText.textContent = p.password;
            
            const status = document.createElement('span');
            status.textContent = p.used ? 'Digunakan' : 'Aktif';
            status.className = p.used ? 'used' : 'active';
            
            passwordItem.appendChild(passwordText);
            passwordItem.appendChild(status);
            passwordListEl.appendChild(passwordItem);
        });
    }
    
    // Fungsi untuk menambahkan nomor ke database GitHub
    async function addNumberToDatabase() {
        const nomor = document.getElementById('phoneNumber').value.trim();
        const githubToken = document.getElementById('githubToken').value.trim();
        const repoOwner = document.getElementById('repoOwner').value.trim();
        const repoName = document.getElementById('repoName').value.trim();
        const filePath = document.getElementById('filePath').value.trim();
        
        if (!nomor) {
            showDbMessage('Nomor WhatsApp harus diisi', 'error');
            return;
        }
        
        if (!githubToken) {
            showDbMessage('GitHub Token harus diisi', 'error');
            return;
        }
        
        // Validasi format nomor (minimal 10 digit, hanya angka)
        if (!/^\d{10,}$/.test(nomor)) {
            showDbMessage('Format nomor tidak valid. Harus berupa angka minimal 10 digit', 'error');
            return;
        }
        
        showDbMessage('Sedang menambahkan nomor ke database...', 'success');
        
        try {
            // Mengambil data saat ini dari GitHub
            const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`, {
                headers: {
                    'Authorization': `token ${githubToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (!response.ok) {
                throw new Error('Gagal mengambil data dari GitHub. Pastikan token dan informasi repo benar.');
            }
            
            const fileData = await response.json();
            const currentContent = atob(fileData.content.replace(/\s/g, ''));
            const numberData = JSON.parse(currentContent);
            
            if (!numberData || !numberData.number || !Array.isArray(numberData.number)) {
                throw new Error('Format database tidak valid. Pastikan file berisi objek dengan properti "number" yang merupakan array.');
            }
            
            // Cek jika nomor sudah ada di database
            if (numberData.number.includes(nomor)) {
                showDbMessage(`Nomor ${nomor} sudah ada di database`, 'error');
                return;
            }
            
            // Tambahkan nomor ke array
            numberData.number.push(nomor);
            
            // Konversi ke base64 (menggunakan encodeURIComponent untuk menghindari masalah encoding)
            const updatedData = JSON.stringify(numberData, null, 2);
            const base64Content = btoa(unescape(encodeURIComponent(updatedData)));
            
            // Update file di GitHub
            const updateResponse = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${githubToken}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: `Menambahkan ${nomor} ke dalam database`,
                    content: base64Content,
                    sha: fileData.sha,
                }),
            });
            
            const updateResult = await updateResponse.json();
            
            if (updateResponse.ok) {
                showDbMessage(`Berhasil menambahkan ${nomor} ke database GitHub ✅`, 'success');
                document.getElementById('phoneNumber').value = '';
            } else {
                throw new Error(updateResult.message || 'Gagal mengupdate file di GitHub');
            }
        } catch (error) {
            console.error('Error:', error);
            showDbMessage(`❌ Error: ${error.message}`, 'error');
        }
    }
});