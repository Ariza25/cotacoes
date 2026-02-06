# Usamos Nginx Alpine para uma imagem leve
FROM nginx:stable-alpine

# Remove arquivos padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia os arquivos buildados para o Nginx
COPY dist/ /usr/share/nginx/html

# Expõe porta 80
EXPOSE 80

# Comando padrão para rodar Nginx
CMD ["nginx", "-g", "daemon off;"]
