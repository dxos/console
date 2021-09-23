//
// Copyright 2021 DXOS.org
//

import React from 'react';

import { SvgIcon } from '@mui/material';

export const DXOS = (props: any) => (
  <SvgIcon {...props} viewBox='0 0 3200 1067'>
    <path fill='none' d='M0 0h3200v1066.67H0z' />
    <path d='M1191.03 327.748v385.175h80.981c28.975 0 55.749-4.945 80.323-14.822 24.587-9.878 45.657-23.373 63.212-40.484 17.554-17.125 31.277-37.424 41.154-60.91 9.878-23.474 14.81-48.819 14.81-76.049 0-27.647-4.717-53.22-14.152-76.706-9.435-23.461-22.829-43.773-40.168-60.897-17.34-17.112-38.511-30.607-63.528-40.497-25.029-9.865-52.904-14.81-83.624-14.81h-79.008zm-51.361-47.403h134.327c37.297 0 71.319 6.147 102.052 18.428 30.72 12.306 57.052 29.202 79.008 50.703 21.943 21.513 38.954 46.858 51.02 76.049 12.065 29.202 18.111 60.897 18.111 95.133 0 34.237-6.261 66.07-18.769 95.475s-29.848 54.763-52.006 76.049c-22.171 21.298-48.402 38.081-78.692 50.374-30.278 12.281-63.199 18.427-98.751 18.427h-136.3V280.345zM1785.58 554.239l-135.63 206.747h-57.951l163.948-246.902-152.742-233.736h57.937l125.753 190.28 125.095-190.28h57.938l-153.4 230.435 163.278 250.203h-57.938L1785.58 554.239zM2301.11 718.848c27.66 0 53.334-5.274 77.035-15.81 23.702-10.535 44.216-24.789 61.555-42.786 17.34-17.997 30.948-38.954 40.826-62.882 9.878-23.917 14.81-49.49 14.81-76.707 0-27.204-4.932-52.777-14.81-76.706-9.878-23.916-23.486-44.873-40.826-62.883-17.339-17.984-37.853-32.251-61.555-42.786-23.701-10.535-49.375-15.809-77.035-15.809-27.659 0-53.334 5.274-77.035 15.809-23.701 10.535-44.228 24.802-61.555 42.786-17.352 18.01-30.948 38.967-40.825 62.883-9.878 23.929-14.81 49.502-14.81 76.706 0 27.217 4.932 52.79 14.81 76.707 9.877 23.928 23.473 44.885 40.825 62.882 17.327 17.997 37.854 32.251 61.555 42.786 23.701 10.536 49.376 15.81 77.035 15.81m0 48.717c-34.236 0-66.285-6.488-96.132-19.426-29.848-12.938-55.952-30.607-78.338-53.005-22.386-22.386-40.067-48.49-53.005-78.338-12.951-29.848-19.427-61.896-19.427-96.133 0-34.236 6.476-66.272 19.427-96.132 12.938-29.836 30.619-55.952 53.005-78.338 22.386-22.386 48.49-40.055 78.338-53.005 29.847-12.951 61.896-19.427 96.132-19.427 34.237 0 66.273 6.476 96.133 19.427 29.835 12.95 55.952 30.619 78.338 53.005 22.386 22.386 40.054 48.502 53.005 78.338 12.951 29.86 19.426 61.896 19.426 96.132 0 34.237-6.475 66.285-19.426 96.133-12.951 29.848-30.619 55.952-53.005 78.338-22.386 22.398-48.503 40.067-78.338 53.005-29.86 12.938-61.896 19.426-96.133 19.426M2802.16 767.565c-39.067 0-72.203-7.791-99.421-23.385-27.217-15.569-50.69-37.196-70.445-64.843l43.456-32.921c16.239 25.017 34.451 43.684 54.649 55.965 20.173 12.293 44.102 18.439 71.761 18.439 14.924 0 28.647-2.301 41.155-6.918 12.508-4.603 23.259-10.864 32.263-18.768 8.993-7.892 16.012-17.441 21.071-28.634 5.034-11.193 7.563-23.372 7.563-36.538 0-14.924-3.288-27.432-9.865-37.538-6.589-10.092-15.379-18.756-26.344-26.003-10.978-7.247-23.486-13.494-37.525-18.768a2454.437 2454.437 0 00-43.456-15.797 712.606 712.606 0 01-49.06-18.769c-16.024-6.791-30.277-15.24-42.786-25.345-12.521-10.093-22.714-22.272-30.619-36.538-7.905-14.266-11.851-31.935-11.851-53.005 0-17.555 3.719-33.908 11.193-49.047 7.462-15.151 17.77-28.317 30.949-39.51 13.165-11.193 28.734-19.97 46.732-26.332 17.997-6.362 37.537-9.549 58.607-9.549 34.237 0 63.212 6.362 86.913 19.098 23.701 12.736 44.329 30.505 61.884 53.334l-40.826 30.278c-24.586-38.183-60.796-57.28-108.628-57.28-13.609 0-26.117 1.973-37.525 5.931-11.433 3.946-21.399 9.536-29.962 16.783-8.562 7.247-15.252 15.696-20.084 25.346-4.831 9.662-7.247 19.982-7.247 30.948 0 14.051 3.188 25.788 9.549 35.223 6.362 9.447 14.823 17.681 25.358 24.687 10.535 7.032 22.715 13.065 36.538 18.111a4308.994 4308.994 0 0043.128 15.481 681.841 681.841 0 0149.375 19.085c16.24 7.032 30.835 15.695 43.786 26.003 12.938 10.32 23.473 22.942 31.605 37.866 8.107 14.924 12.18 33.364 12.18 55.307 0 17.997-3.617 35.223-10.864 51.69-7.247 16.454-17.681 31.049-31.277 43.772-13.609 12.736-29.848 22.942-48.718 30.619-18.883 7.677-39.953 11.522-63.212 11.522M893.472 909.428l-338.469-211.54 92.313-126.929 246.156 338.469zM398.96 570.959l92.313 126.929-338.469 211.54L398.96 570.959zM152.804 157.226l338.469 211.54-92.313 126.929-246.156-338.469zm392.473 273.423l74.67 102.684-74.67 102.672V430.649zm-44.266 205.356l-74.682-102.672 74.682-102.684v205.356zm146.305-140.31l-92.313-126.929 338.469-211.54-246.156 338.469zm349.03-404.653l-29.633-31.783L523.144 336.49 79.563 59.259 49.93 91.042l321.661 442.291L49.93 975.612l29.633 31.795 443.581-277.243 443.569 277.243 29.633-31.795-321.661-442.279L996.346 91.042z' />
  </SvgIcon>
);
