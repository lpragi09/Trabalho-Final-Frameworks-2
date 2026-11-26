import { useCallback, useEffect, useState } from 'react';
import { mensagemDeErro } from '../api/client';

/**
 * Executa uma chamada à API e controla os estados de loading, erro e dados.
 * `recarregar()` refaz a chamada (ex.: depois de excluir um item).
 */
export function useApi(chamada, dependencias = []) {
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [versao, setVersao] = useState(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const executar = useCallback(chamada, dependencias);

  useEffect(() => {
    let ativo = true;
    setCarregando(true);
    setErro(null);
    executar()
      .then((resposta) => ativo && setDados(resposta))
      .catch((e) => ativo && setErro(mensagemDeErro(e)))
      .finally(() => ativo && setCarregando(false));
    return () => {
      ativo = false;
    };
  }, [executar, versao]);

  const recarregar = useCallback(() => setVersao((v) => v + 1), []);

  return { dados, carregando, erro, recarregar };
}
