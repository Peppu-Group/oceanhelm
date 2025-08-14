<template>
    <body>
        <div class="container">
            <h1>Input Company Code</h1>

            <div class="input-container">
                <div class="code-inputs">
                    <input v-for="i in 8" :key="i" v-model="code[i - 1]" :type="showPassword ? 'text' : 'password'"
                        class="code-input" maxlength="1" @input="handleInput($event, i - 1)"
                        @keydown="handleKeydown($event, i - 1)" @paste="handlePaste($event, i - 1)">
                </div>

                <div class="visibility-toggle" @click="toggleVisibility">
                    <svg class="eye-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path v-if="showPassword"
                            d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                        <path v-else
                            d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
                    </svg>
                    <span>{{ showPassword ? 'Hide' : 'Show' }} Code</span>
                </div>
            </div>

            <button class="submit-btn" @click="submitCode">
                Submit Code
            </button>
        </div>
    </body>
</template>

<script>
import supabase from '../supabase'

export default {
    name: 'Code',

    data() {
        return {
            code: ['', '', '', '', '', '', '', ''],
            showPassword: false
        }
    },
    methods: {
        handleInput(event, index) {
            const value = event.target.value;

            // Only allow alphanumeric characters
            if (value && !/^[a-zA-Z0-9]$/.test(value)) {
                event.target.value = this.code[index];
                return;
            }

            this.code[index] = value.toUpperCase();

            // Auto-focus next input
            if (value && index < 7) {
                const nextInput = event.target.parentNode.children[index + 1];
                nextInput.focus();
            }
        },

        handleKeydown(event, index) {
            // Handle backspace
            if (event.key === 'Backspace' && !this.code[index] && index > 0) {
                const prevInput = event.target.parentNode.children[index - 1];
                prevInput.focus();
            }

            // Handle arrow keys
            if (event.key === 'ArrowLeft' && index > 0) {
                event.target.parentNode.children[index - 1].focus();
            } else if (event.key === 'ArrowRight' && index < 7) {
                event.target.parentNode.children[index + 1].focus();
            }
        },

        handlePaste(event, index) {
            event.preventDefault();
            const paste = (event.clipboardData || window.clipboardData).getData('text');
            const chars = paste.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().split('');

            for (let i = 0; i < chars.length && (index + i) < 8; i++) {
                this.code[index + i] = chars[i];
            }

            // Focus the next empty input or last input
            const nextEmptyIndex = this.code.findIndex((char, i) => i >= index && !char);
            const targetIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : Math.min(index + chars.length, 7);
            event.target.parentNode.children[targetIndex].focus();
        },

        toggleVisibility() {
            this.showPassword = !this.showPassword;
        },

        async getCodeRow(codeValue) {
            const { data, error } = await supabase
                .from('code')
                .select('*')
                .eq('code', codeValue);

            if (error) {
                console.error('Error fetching code row:', error);
                return [];
            }

            return data; // always an array, possibly empty
        },

        submitCode() {
            const fullCode = this.code.join('');
            if (fullCode.length === 8) {
                this.getCodeRow(fullCode).then((resp) => {
                    // check if company-id matches
                    // redirect to home page
                    // Encode session and redirect to subdomain
                    let session = localStorage.getItem('sb-qltidnqgczccstukalgy-auth-token');
                    const encoded = encodeURIComponent(JSON.stringify(session));
                    window.location.href = `${resp.url}/receive-session?session=${encoded}`;
                })
            } else {
                alert('Please enter all 8 characters of the company code.');
            }
        }
    }
}
</script>

<style scoped>
body {

    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.container {
    background: white;
    padding: 3rem;
    border-radius: 20px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    text-align: center;
    max-width: 500px;
    width: 90%;
}

h1 {
    color: #333;
    margin-bottom: 2rem;
    font-size: 2rem;
    font-weight: 600;
}

.input-container {
    position: relative;
    margin-bottom: 2rem;
}

.code-inputs {
    display: flex;
    gap: 12px;
    justify-content: center;
    margin-bottom: 1rem;
}

.code-input {
    width: 50px;
    height: 60px;
    border: 2px solid #e1e5e9;
    border-radius: 12px;
    text-align: center;
    font-size: 1.5rem;
    font-weight: 600;
    color: #333;
    background: #f8f9fa;
    transition: all 0.3s ease;
    outline: none;
}

.code-input:focus {
    border-color: var(--dashprimary-color);
    background: white;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    transform: translateY(-2px);
}

.code-input:not(:placeholder-shown) {
    border-color: #28a745;
    background: #f8fff8;
}

.visibility-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-top: 1rem;
    cursor: pointer;
    color: #666;
    font-size: 0.9rem;
    transition: color 0.3s ease;
}

.visibility-toggle:hover {
    color: var(--dashprimary-color);
}

.eye-icon {
    width: 20px;
    height: 20px;
    transition: transform 0.3s ease;
}

.visibility-toggle:hover .eye-icon {
    transform: scale(1.1);
}

.submit-btn {
    background: linear-gradient(135deg, var(--dashprimary-color) 0%, var(--dashsecondary-color) 100%);
    color: white;
    border: none;
    padding: 12px 30px;
    border-radius: 25px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 1rem;
}

.submit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.submit-btn:active {
    transform: translateY(0);
}

@media (max-width: 600px) {
    .container {
        padding: 1.5rem;
        width: 95%;
    }

    .code-inputs {
        gap: 6px;
        flex-wrap: nowrap;
        overflow-x: auto;
        justify-content: center;
        padding: 0 5px;
    }

    .code-input {
        width: 35px;
        height: 45px;
        font-size: 1.1rem;
        flex-shrink: 0;
    }

    h1 {
        font-size: 1.5rem;
        margin-bottom: 1.5rem;
    }
}

@media (max-width: 400px) {
    .container {
        padding: 1rem;
        width: 98%;
    }

    .code-inputs {
        gap: 4px;
        padding: 0 2px;
    }

    .code-input {
        width: 32px;
        height: 42px;
        font-size: 1rem;
    }

    h1 {
        font-size: 1.3rem;
        margin-bottom: 1rem;
    }

    .visibility-toggle {
        font-size: 0.8rem;
    }

    .eye-icon {
        width: 18px;
        height: 18px;
    }
}
</style>