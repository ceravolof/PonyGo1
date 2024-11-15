<template>
  <div class="auth-container">
    <div class="auth-box">
      <!-- Scheda per scegliere Login o Registrazione -->
      <div class="toggle">
        <button :class="{ active: isLoginMode }" @click="isLoginMode = true">Login</button>
        <button :class="{ active: !isLoginMode }" @click="isLoginMode = false">Registrazione</button>
      </div>

      <!-- Form per il Login -->
      <div v-if="isLoginMode" class="form-container">
        <h2>Login</h2>
        <input v-model="loginData.email" type="email" placeholder="Email" />
        <input v-model="loginData.passwd" type="password" placeholder="Password" />
        <button @click="loginUser">Accedi</button>
      </div>

      <!-- Form per la Registrazione -->
      <div v-else class="form-container">
        <h2>Registrazione</h2>
        <input v-model="registerData.userid" type="text" placeholder="UserID" />
        <input v-model="registerData.email" type="email" placeholder="Email" />
        <input v-model="registerData.passwd" type="password" placeholder="Password" />
        <input v-model="registerData.type" type="text" placeholder="Tipo (es: admin, user)" />
        <button @click="registerUser">Registrati</button>
      </div>

      <!-- Messaggio di errore o successo -->
      <div v-if="message" class="message-box">
        <p>{{ message }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLoginMode: true, // Per cambiare tra login e registrazione
      registerData: {
        userid: '',
        email: '',
        passwd: '',
        type: ''
      },
      loginData: {
        email: '',
        passwd: ''
      },
      message: '' // Per mostrare i messaggi di successo o errore
    };
  },
  methods: {
    // Funzione per inviare richiesta di registrazione
    registerUser() {
      fetch('http://65.109.130.148:3000/utenti', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.registerData)
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Errore durante la registrazione');
          }
          return response.json();
        })
        .then(data => {
          this.message = data.message;
        })
        .catch(error => {
          console.error('Errore nella registrazione:', error);
          this.message = 'Errore durante la registrazione. Riprova.';
        });
    },

    // Funzione per inviare richiesta di login
    loginUser() {
      fetch('http://65.109.130.148:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.loginData)
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Errore durante il login');
          }
          return response.json();
        })
        .then(data => {
          if (data.message === 'Autenticazione avvenuta con successo') {
            this.message = 'Benvenuto, ' + data.user.userid;
            // Salva il token o i dati dell'utente (se necessario)
            localStorage.setItem('userToken', data.token); // esempio
          } else {
            this.message = data.message;
          }
        })
        .catch(error => {
          console.error('Errore nel login:', error);
          this.message = 'Errore durante il login. Riprova.';
        });
    }
  }
};
</script>

<style scoped>
/* Stili di base per la pagina */
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f4f9;
}

.auth-box {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 300px;
  text-align: center;
}

.toggle {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.toggle button {
  flex: 1;
  padding: 10px;
  border: none;
  background: #ddd;
  cursor: pointer;
  outline: none;
}

.toggle button.active {
  background: #4CAF50;
  color: white;
}

.form-container {
  display: flex;
  flex-direction: column;
}

input {
  margin-bottom: 10px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
  outline: none;
}

button {
  padding: 10px;
  font-size: 16px;
  border: none;
  background-color: #4CAF50;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.message-box {
  margin-top: 20px;
  color: red;
}
</style>
