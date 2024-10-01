const estadosECidades = {
  "São Paulo": ["São Paulo", "Guarulhos", "Campinas", "Santos", "Sorocaba"],
  "Rio de Janeiro": ["Rio de Janeiro", "Niterói", "Petrópolis", "Duque de Caxias", "Volta Redonda"],
  "Brasília": ["Brasília", "Taguatinga", "Ceilândia", "Gama", "Samambaia"],
  "Bahia": ["Salvador", "Feira de Santana", "Vitória da Conquista", "Camaçari", "Itabuna"],
  "Paraná": ["Curitiba", "Londrina", "Maringá", "Ponta Grossa", "Cascavel"],
  "Rio Grande do Sul": ["Porto Alegre", "Canoas", "Pelotas", "Gravataí", "Santa Maria"],
  "Minas Gerais": ["Belo Horizonte", "Uberlândia", "Contagem", "Juiz de Fora", "Betim"],
  "Ceará": ["Fortaleza", "Caucaia", "Juazeiro do Norte", "Maracanaú", "Sobral"],
  "Pernambuco": ["Recife", "Olinda", "Jaboatão dos Guararapes", "Caruaru", "Petrolina"],
  "Santa Catarina": ["Florianópolis", "Joinville", "Blumenau", "Chapecó", "Itajaí"],
  "Mato Grosso": ["Cuiabá", "Várzea Grande", "Rondonópolis", "Sinop", "Tangará da Serra"],
  "Mato Grosso do Sul": ["Campo Grande", "Dourados", "Três Lagoas", "Corumbá", "Ponta Porã"],
  "Espírito Santo": ["Vitória", "Vila Velha", "Serra", "Cariacica", "Linhares"],
  "Alagoas": ["Maceió", "Arapiraca", "Palmeira dos Índios", "Rio Largo", "Satuba"],
  "Sergipe": ["Aracaju", "Nossa Senhora do Socorro", "Lagarto", "Itabaiana", "Estância"],
  "Tocantins": ["Palmas", "Araguaína", "Gurupi", "Paraíso do Tocantins", "Porto Nacional"],
  "Pará": ["Belém", "Ananindeua", "Santarém", "Marabá", "Castanhal"],
  "Amapá": ["Macapá", "Santana", "Laranjal do Jari", "Tartarugalzinho", "Ferreira Gomes"],
  "Acre": ["Rio Branco", "Cruzeiro do Sul", "Sena Madureira", "Tarauacá", "Brasileia"],
  "Rondônia": ["Porto Velho", "Ji-Paraná", "Vilhena", "Cacoal", "Rolim de Moura"],
  "Roraima": ["Boa Vista", "Rorainópolis", "Caracaraí", "Mucajaí", "Cantá"],
};

const estadosECidadesOrdenados = Object.keys(estadosECidades)
  .sort()
  .reduce((acc, estado) => {
    acc[estado] = estadosECidades[estado].sort();
    return acc;
  }, {});

export default estadosECidadesOrdenados;
