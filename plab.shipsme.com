server {
        listen 80;

        root /home/ubuntu/brainlife_lab/plab.hugo/public/;
        index index.html index.htm index.nginx-debian.html;

        server_name plab.shipsme.com www.plab.shipsme.com;

        location / {
                try_files $uri $uri/ =404;
        }

location /myservice {
        rewrite ^/myservice/(.*)$ /$1 break;

        proxy_http_version 1.1;
        proxy_cache_bypass $http_upgrade;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_pass http://localhost:3000;
}

location /profile {
 proxy_pass http://localhost:3000/profile ;
}
	

}
