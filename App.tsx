import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Flame, Moon, Skull, Play, Pause, Shuffle, CarFront, Bone, Church, ChessKnight, SkipBack, SkipForward } from 'lucide-react-native';
import { useAudioPlayer, useAudioPlayerStatus, setAudioModeAsync } from 'expo-audio';

interface Musica {
  id: number;
  titulo: string;
  duracao: string;
  icone: string;
  arquivo: any;
}

const RenderizarIcone = ({ nome, size, color }: { nome: string; size: number; color: string }) => {
  switch (nome) {
    case 'Moon': return <Moon size={size} color={color} />;
    case 'Skull': return <Skull size={size} color={color} />;
    case 'CarFront': return <CarFront size={size} color={color} />;
    case 'Bone': return <Bone size={size} color={color} />;
    case 'Church': return <Church size={size} color={color} />;
    case 'ChessKnight': return <ChessKnight size={size} color={color} />;
    default: return <Moon size={size} color={color} />;
  }
};

export default function App() {
  const [musicaAtual, setMusicaAtual] = useState<Musica | null>(null);
  const [modoShuffle, setModoShuffle] = useState<boolean>(false);

  const player = useAudioPlayer();
  const status = useAudioPlayerStatus(player);

  const estaTocando = status.playing;
  const posicaoSom = status.currentTime ?? 0;
  const duracaoSom = status.duration ?? 0;

  const listaDeLendas: Musica[] = [
    { id: 0, titulo: 'Capão do Manhoso', duracao: '5 min 12 seg', icone: 'Moon', arquivo: require('./assets/audios/capao.mp3') },
    { id: 1, titulo: 'Corpo Seco', duracao: '5 min 12 seg', icone: 'Skull', arquivo: require('./assets/audios/corposeco.mp3') },
    { id: 2, titulo: 'A Noiva de Branco', duracao: '5 min 12 seg', icone: 'CarFront', arquivo: require('./assets/audios/anoivadebranco.mp3') },
    { id: 3, titulo: 'A Farinheira', duracao: '5 min 12 seg', icone: 'Bone', arquivo: require('./assets/audios/afarinheira.mp3') },
    { id: 4, titulo: 'O Roubo da Cruz', duracao: '5 min 12 seg', icone: 'Church', arquivo: require('./assets/audios/oroubodacruz.mp3') },
    { id: 5, titulo: 'O Tropeiro Fantasma', duracao: '5 min 12 seg', icone: 'ChessKnight', arquivo: require('./assets/audios/otropeirofantasma.mp3') }
  ];

  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
      interruptionMode: 'duckOthers',
    });
  }, []);

  useEffect(() => {
    if (status.didJustFinish) {
      avancarMusica();
    }
  }, [status.didJustFinish]);

  function tocarAudio(musica: Musica) {
    try {
      player.replace(musica.arquivo);
      player.play();
    } catch (error) {
      console.error('Erro ao tocar o áudio:', error);
    }
  }

  const selecionarMusica = (musica: Musica) => {
    setMusicaAtual(musica);
    tocarAudio(musica);
  };

  const avancarMusica = () => {
    if (!musicaAtual) return;
    let proximaMusica;
    if (modoShuffle) {
      const indiceAleatorio = Math.floor(Math.random() * listaDeLendas.length);
      proximaMusica = listaDeLendas[indiceAleatorio];
    } else {
      const proximoId = (musicaAtual.id + 1) % listaDeLendas.length;
      proximaMusica = listaDeLendas.find(m => m.id === proximoId);
    }
    if (proximaMusica) {
      setMusicaAtual(proximaMusica);
      tocarAudio(proximaMusica);
    }
  };

  const voltarMusica = () => {
    if (!musicaAtual) return;
    const idAnterior = (musicaAtual.id - 1 + listaDeLendas.length) % listaDeLendas.length;
    const musicaAnterior = listaDeLendas.find(m => m.id === idAnterior);
    if (musicaAnterior) {
      setMusicaAtual(musicaAnterior);
      tocarAudio(musicaAnterior);
    }
  };

  const alternarPlayPause = () => {
    if (estaTocando) {
      player.pause();
    } else {
      player.play();
    }
  };

  const alternarShuffle = () => {
    setModoShuffle(!modoShuffle);
  };

  const tocarPlaylist = () => {
    if (musicaAtual) {
      alternarPlayPause();
    } else {
      if (modoShuffle) {
        const indiceAleatorio = Math.floor(Math.random() * listaDeLendas.length);
        selecionarMusica(listaDeLendas[indiceAleatorio]);
      } else {
        selecionarMusica(listaDeLendas[0]);
      }
    }
  };

  const porcentagemProgresso = duracaoSom > 0 ? posicaoSom / duracaoSom : 0;

  return (
    <View style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
      <View style={{
        width: '100%',
        height: 60,
        paddingTop: 20,
        backgroundColor: '#0d0d0d',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)'
      }}>
        <Text style={{ color: '#cc0000', fontWeight: '900', fontSize: 16, letterSpacing: 2, fontFamily: 'serif' }}>
          PALMEIRA • LENDAS
        </Text>
      </View>

      <LinearGradient
        colors={['#3a0000', '#1a0000', '#0a0a0a']}
        style={{ flex: 1 }}
      >
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 120 }}>
          <View style={{ alignItems: 'center', marginBottom: 24 }}>
            <View style={{
              width: 200,
              height: 200,
              backgroundColor: '#1a0000',
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#8b000055',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 24
            }}>
              <Flame size={80} color='#990000' />
            </View>

            <Text style={{
              color: '#cc0000',
              fontSize: 14,
              fontWeight: '500',
              letterSpacing: 2,
              marginBottom: 6,
              marginTop: 16
            }}>
              PLAYLIST
            </Text>

            <Text style={{
              color: '#f0f0f0',
              fontSize: 36,
              fontWeight: '900',
              textAlign: 'center',
              fontFamily: 'serif',
              lineHeight: 32
            }}>
              LENDAS DE{"\n"}PALMEIRA
            </Text>

            <Text style={{
              color: '#777777',
              fontSize: 13,
              marginTop: 10,
              marginBottom: 24
            }}>
              <Text style={{ color: '#f0f0f0', fontWeight: '500' }}>6 lendas</Text> • 35 min 51 seg
            </Text>

            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 32,
              gap: 32
            }}>
              <TouchableOpacity onPress={tocarPlaylist}>
                <View style={{
                  width: 64,
                  height: 64,
                  backgroundColor: '#cc0000',
                  borderRadius: 32,
                  justifyContent: 'center',
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.4,
                  shadowRadius: 4,
                  elevation: 5
                }}>
                  {estaTocando ? (
                    <Pause size={20} fill="#f0f0f0" stroke="#f0f0f0" />
                  ) : (
                    <Play size={20} fill="#f0f0f0" stroke="#f0f0f0" />
                  )}
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={alternarShuffle}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Shuffle size={32} color={modoShuffle ? '#cc0000' : '#777777'} />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ width: '100%' }}>
            <TouchableOpacity onPress={() => selecionarMusica(listaDeLendas[0])}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 16,
                paddingVertical: 8,
                width: '100%'
              }}>
                <View style={{
                  width: 52,
                  height: 52,
                  backgroundColor: 'rgba(139, 0, 0, 0.2)',
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: '#8b000055',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 16
                }}>
                  <Moon size={24} color='#8b000055' />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#f0f0f0', fontSize: 16, fontWeight: '600', marginBottom: 4 }}>Capão do Manhoso</Text>
                  <Text style={{ color: '#777777', fontSize: 13 }}>5 min 12 seg</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => selecionarMusica(listaDeLendas[1])}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 16,
                paddingVertical: 8,
                width: '100%'
              }}>
                <View style={{
                  width: 52,
                  height: 52,
                  backgroundColor: 'rgba(139, 0, 0, 0.2)',
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: '#8b000055',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 16
                }}>
                  <Skull size={24} color='#8b000055' />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#f0f0f0', fontSize: 16, fontWeight: '600', marginBottom: 4 }}>Corpo Seco</Text>
                  <Text style={{ color: '#777777', fontSize: 13 }}>5 min 12 seg</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => selecionarMusica(listaDeLendas[2])}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 16,
                paddingVertical: 8,
                width: '100%'
              }}>
                <View style={{
                  width: 52,
                  height: 52,
                  backgroundColor: 'rgba(139, 0, 0, 0.2)',
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: '#8b000055',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 16
                }}>
                  <CarFront size={24} color='#8b000055' />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#f0f0f0', fontSize: 16, fontWeight: '600', marginBottom: 4 }}>A Noiva de Branco</Text>
                  <Text style={{ color: '#777777', fontSize: 13 }}>5 min 12 seg</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => selecionarMusica(listaDeLendas[3])}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 16,
                paddingVertical: 8,
                width: '100%'
              }}>
                <View style={{
                  width: 52,
                  height: 52,
                  backgroundColor: 'rgba(139, 0, 0, 0.2)',
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: '#8b000055',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 16
                }}>
                  <Bone size={24} color='#8b000055' />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#f0f0f0', fontSize: 16, fontWeight: '600', marginBottom: 4 }}>A Farinheira</Text>
                  <Text style={{ color: '#777777', fontSize: 13 }}>5 min 12 seg</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => selecionarMusica(listaDeLendas[4])}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 16,
                paddingVertical: 8,
                width: '100%'
              }}>
                <View style={{
                  width: 52,
                  height: 52,
                  backgroundColor: 'rgba(139, 0, 0, 0.2)',
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: '#8b000055',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 16
                }}>
                  <Church size={24} color='#8b000055' />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#f0f0f0', fontSize: 16, fontWeight: '600', marginBottom: 4 }}>O Roubo da Cruz</Text>
                  <Text style={{ color: '#777777', fontSize: 13 }}>5 min 12 seg</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => selecionarMusica(listaDeLendas[5])}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 16,
                paddingVertical: 8,
                width: '100%'
              }}>
                <View style={{
                  width: 52,
                  height: 52,
                  backgroundColor: 'rgba(139, 0, 0, 0.2)',
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: '#8b000055',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 16
                }}>
                  <ChessKnight size={24} color='#8b000055' />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#f0f0f0', fontSize: 16, fontWeight: '600', marginBottom: 4 }}>O Tropeiro Fantasma</Text>
                  <Text style={{ color: '#777777', fontSize: 13 }}>5 min 12 seg</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>

      {musicaAtual && (
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <View style={{
            position: 'absolute',
            bottom: 24,
            left: 16,
            right: 16,
            backgroundColor: '#1a0000',
            borderRadius: 12,
            borderWidth: 1,
            borderColor: '#8b000055',
            paddingHorizontal: 16,
            paddingVertical: 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <View style={{
                width: 40,
                height: 40,
                backgroundColor: 'rgba(139, 0, 0, 0.2)',
                borderRadius: 4,
                borderWidth: 1,
                borderColor: '#8b000055',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <RenderizarIcone nome={musicaAtual.icone} size={20} color='#8b000055' />
              </View>

              <View style={{ flex: 1, marginLeft: 12, marginRight: 16 }}>
                <Text numberOfLines={1} style={{ color: '#f0f0f0', fontSize: 14, fontWeight: '600' }}>
                  {musicaAtual.titulo}
                </Text>
                <Text numberOfLines={1} style={{ color: '#777777', fontSize: 12, marginTop: 2 }}>
                  {estaTocando ? "Tocando agora" : "Pausado"}
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
              <TouchableOpacity onPress={voltarMusica}>
                <SkipBack size={24} color='#f0f0f0' />
              </TouchableOpacity>

              <TouchableOpacity onPress={alternarPlayPause}>
                {estaTocando ? (
                  <Pause size={24} fill="#f0f0f0" stroke="#f0f0f0" />
                ) : (
                  <Play size={24} fill="#f0f0f0" stroke="#f0f0f0" />
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={avancarMusica}>
                <SkipForward size={24} color='#f0f0f0' />
              </TouchableOpacity>
            </View>

            <View style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              backgroundColor: '#333333',
              overflow: 'hidden',
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12
            }}>
              <View style={{
                width: `${porcentagemProgresso * 100}%`,
                height: '100%',
                backgroundColor: "#cc0000"
              }}></View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}