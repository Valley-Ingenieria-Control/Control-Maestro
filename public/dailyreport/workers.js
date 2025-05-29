const workers = [
  // Piping
  { nombre: "Felipe Reyes", rut: "12345678-9", especialidad: "Piping", cargo: "M1" },
  { nombre: "Mario Silva", rut: "23456789-0", especialidad: "Piping", cargo: "Ayudante" },
  { nombre: "Cristóbal Paredes", rut: "56789012-3", especialidad: "Piping", cargo: "Soldador" },
  { nombre: "Kevin Castro", rut: "89012345-6", especialidad: "Piping", cargo: "Ayudante" },
  { nombre: "Andrea Soto", rut: "99887766-5", especialidad: "Piping", cargo: "M2" },
  { nombre: "Javier Rojas", rut: "11224433-7", especialidad: "Piping", cargo: "M1" },
  { nombre: "Patricio Vera", rut: "22335544-8", especialidad: "Piping", cargo: "M2" },
  { nombre: "Gabriel Torres", rut: "33446655-9", especialidad: "Piping", cargo: "Soldador" },
  { nombre: "Rodrigo Díaz", rut: "44557766-0", especialidad: "Piping", cargo: "Ayudante" },
  { nombre: "Felipe Reyes", rut: "12345678-0", especialidad: "Piping", cargo: "M2" }, // repetido con otro rut
  { nombre: "Andrea Soto", rut: "99887766-6", especialidad: "Piping", cargo: "Ayudante" }, // repetido con otro rut

  // Electricidad
  { nombre: "José Díaz", rut: "34567890-1", especialidad: "Electricidad", cargo: "Técnico" },
  { nombre: "Camila Rojas", rut: "67890123-4", especialidad: "Electricidad", cargo: "Ayudante" },
  { nombre: "Matías Méndez", rut: "90123456-7", especialidad: "Electricidad", cargo: "Técnico" },
  { nombre: "Valentina López", rut: "22334455-6", especialidad: "Electricidad", cargo: "M1" },
  { nombre: "Sebastián Fuentes", rut: "33445566-8", especialidad: "Electricidad", cargo: "M2" },
  { nombre: "Francisco Silva", rut: "44556677-9", especialidad: "Electricidad", cargo: "Ayudante" },
  { nombre: "Daniela Pino", rut: "55667788-0", especialidad: "Electricidad", cargo: "Técnico" },
  { nombre: "Ignacio Reyes", rut: "66778899-1", especialidad: "Electricidad", cargo: "M1" },
  { nombre: "María Torres", rut: "77889900-2", especialidad: "Electricidad", cargo: "M2" },
  { nombre: "Camila Rojas", rut: "67890123-5", especialidad: "Electricidad", cargo: "M2" }, // repetido con otro rut

  // Obras Civiles
  { nombre: "Jorge Tapia", rut: "45678901-2", especialidad: "Obras Civiles", cargo: "Capataz" },
  { nombre: "Ignacio Troncoso", rut: "78901234-5", especialidad: "Obras Civiles", cargo: "M2" },
  { nombre: "Paula Araya", rut: "11223344-5", especialidad: "Obras Civiles", cargo: "Capataz" },
  { nombre: "Sofía Herrera", rut: "33445566-7", especialidad: "Obras Civiles", cargo: "Ayudante" },
  { nombre: "Carlos Muñoz", rut: "44556677-8", especialidad: "Obras Civiles", cargo: "M1" },
  { nombre: "Andrea Figueroa", rut: "55667788-9", especialidad: "Obras Civiles", cargo: "M2" },
  { nombre: "Felipe González", rut: "66778899-0", especialidad: "Obras Civiles", cargo: "Ayudante" },
  { nombre: "Lorena Salinas", rut: "77889900-1", especialidad: "Obras Civiles", cargo: "M1" },
  { nombre: "Tomás Castillo", rut: "88990011-2", especialidad: "Obras Civiles", cargo: "M2" },
  { nombre: "Jorge Tapia", rut: "45678901-3", especialidad: "Obras Civiles", cargo: "Ayudante" }, // repetido con otro rut

  // Mecánica
  { nombre: "Luis Morales", rut: "55667788-9", especialidad: "Mecánica", cargo: "Técnico" },
  { nombre: "Daniela Figueroa", rut: "66778899-0", especialidad: "Mecánica", cargo: "Ayudante" },
  { nombre: "Pedro González", rut: "77889900-1", especialidad: "Mecánica", cargo: "M1" },
  { nombre: "Ricardo Soto", rut: "88990011-3", especialidad: "Mecánica", cargo: "M2" },
  { nombre: "María Carrasco", rut: "99001122-4", especialidad: "Mecánica", cargo: "Ayudante" },
  { nombre: "Joaquín Peña", rut: "10111213-5", especialidad: "Mecánica", cargo: "Técnico" },
  { nombre: "Patricia Vargas", rut: "12131415-6", especialidad: "Mecánica", cargo: "M1" },
  { nombre: "Cristian Rivas", rut: "13141516-7", especialidad: "Mecánica", cargo: "M2" },
  { nombre: "Luis Morales", rut: "55667788-0", especialidad: "Mecánica", cargo: "M1" }, // repetido con otro rut

  // Instrumentación
  { nombre: "Carla Peña", rut: "88990011-2", especialidad: "Instrumentación", cargo: "Técnico" },
  { nombre: "Tomás Vidal", rut: "99001122-3", especialidad: "Instrumentación", cargo: "Ayudante" },
  { nombre: "Gabriela Herrera", rut: "14151617-8", especialidad: "Instrumentación", cargo: "M1" },
  { nombre: "Esteban Morales", rut: "15161718-9", especialidad: "Instrumentación", cargo: "M2" },
  { nombre: "Natalia Castro", rut: "16171819-0", especialidad: "Instrumentación", cargo: "Ayudante" },
  { nombre: "Rodrigo Paredes", rut: "17181920-1", especialidad: "Instrumentación", cargo: "Técnico" },
  { nombre: "Verónica Díaz", rut: "18192021-2", especialidad: "Instrumentación", cargo: "M1" },
  { nombre: "Mauricio Salas", rut: "19202122-3", especialidad: "Instrumentación", cargo: "M2" },
  { nombre: "Carla Peña", rut: "88990011-3", especialidad: "Instrumentación", cargo: "M2" }, // repetido con otro rut

  // Más trabajadores variados
  { nombre: "Juan Pérez", rut: "20112233-4", especialidad: "Piping", cargo: "Ayudante" },
  { nombre: "Ana Martínez", rut: "21123344-5", especialidad: "Electricidad", cargo: "M1" },
  { nombre: "Pedro Ramírez", rut: "22134455-6", especialidad: "Obras Civiles", cargo: "Capataz" },
  { nombre: "Sergio López", rut: "23145566-7", especialidad: "Mecánica", cargo: "Técnico" },
  { nombre: "Lucía González", rut: "24156677-8", especialidad: "Instrumentación", cargo: "Ayudante" },
  { nombre: "Juan Pérez", rut: "20112233-5", especialidad: "Piping", cargo: "M2" }, // repetido con otro rut
  { nombre: "Ana Martínez", rut: "21123344-6", especialidad: "Electricidad", cargo: "Ayudante" }, // repetido con otro rut
  { nombre: "Pedro Ramírez", rut: "22134455-7", especialidad: "Obras Civiles", cargo: "M1" }, // repetido con otro rut
  { nombre: "Sergio López", rut: "23145566-8", especialidad: "Mecánica", cargo: "M2" }, // repetido con otro rut
  { nombre: "Lucía González", rut: "24156677-9", especialidad: "Instrumentación", cargo: "M1" } // repetido con otro rut
];