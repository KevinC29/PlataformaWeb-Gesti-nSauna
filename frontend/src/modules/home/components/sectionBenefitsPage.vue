<template>
    <!-- Sección Quienes Somos -->
    <section id="benefits" class="section-benefits">
        <div class="section-img">
        </div>
        <v-container class="section-left">
            <div class="content">
                <h1>Quienes Somos</h1>
                <p>Conoce más sobre nosotros. Aquí va un texto introductorio sobre quiénes somos y lo que hacemos. Somos
                    una empresa dedicada a proporcionar servicios de calidad y siempre buscamos la satisfacción del
                    cliente.</p>
            </div>
        </v-container>

        <!-- Contenedor derecho -->
        <v-container class="section-right">
            <div class="content">
                <h1>Beneficios de los baños a vapor</h1>
                <ul>
                    <li><v-icon left class="mr-2" icon="mdi-check-decagram"></v-icon>Relajación total del cuerpo.</li>
                    <li><v-icon left class="mr-2" icon="mdi-check-decagram"></v-icon>Mejora la circulación sanguínea.</li>
                    <li><v-icon left class="mr-2" icon="mdi-check-decagram"></v-icon>Alivio de estrés y tensiones.</li>
                    <li><v-icon left class="mr-2" icon="mdi-check-decagram"></v-icon>Mejora la salud respiratoria.</li>
                    <li><v-icon left class="mr-2" icon="mdi-check-decagram"></v-icon>Renovación de la piel.</li>
                </ul>
            </div>
        </v-container>
    </section>
</template>

<script>
import '@/assets/styles/sectionBenefits.css';

export default {
    name: 'SectionBenefitsPage',
};
</script>