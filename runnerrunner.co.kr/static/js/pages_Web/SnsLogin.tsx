import {useHistory, useParams} from "react-router-dom";
import {useCallback, useEffect} from "react";
import {enqueueSnackbar} from "notistack";
import useQueryParams from "../../hooks/useQueryParams";
import axios from "axios";
import {getGoogleToken, getNaverToken} from "../../api/auth";

function SnsLogin() {
  const history = useHistory();
  const params = useParams<{
    type: string
  }>();
  const query = useQueryParams();

  const doLogin = (loginType: string, accessToken: string, redirect: string) => {
    history.replace('/login', {
      redirect: redirect || '',
      loginType: loginType,
      accessToken: accessToken,
    })
  }

  const handleKakao = useCallback((code: string, redirect: string) => {
    const params = new URLSearchParams();
    params.append('client_id', process.env.REACT_APP_KAKAO_API_KEY!);
    params.append('grant_type', 'authorization_code');
    params.append('redirect_uri', window.location.origin + window.location.pathname);
    params.append('code', code)

    axios.post('https://kauth.kakao.com/oauth/token', params).then((res: any) => {
      doLogin('SIMPLE_KAKAO', res.data.access_token, redirect);
    }).catch((e: any) => {
      console.error(e);
      enqueueSnackbar("SNS 로그인을 실패했습니다.", {variant: 'error'});
      history.replace('/login');
    });
  }, [])

  const handleNaver = useCallback((code: string, redirect: string) => {
    getNaverToken(code).then((res) => {
      if (res) {
        doLogin('SIMPLE_NAVER', res, redirect);
      } else {
        throw res;
      }
    }).catch((e) => {
      console.error(e);
      enqueueSnackbar("SNS 로그인을 실패했습니다.", {variant: 'error'});
      history.replace('/login');
    });
  }, []);

  const handleGoogle = useCallback((code: string, redirect: string) => {
    getGoogleToken(code).then((res) => {
      if (res) {
        doLogin('SIMPLE_GOOGLE', res, redirect);
      } else {
        throw res;
      }
    }).catch((e) => {
      console.error(e);
      enqueueSnackbar("SNS 로그인을 실패했습니다.", {variant: 'error'});
      history.replace('/login');
    });
  }, []);

  useEffect(() => {
    const type = params.type;
    const code = query.get('code');
    if (!code) {
      enqueueSnackbar("SNS 로그인이 취소되었습니다.", {variant: 'error'});
      history.replace('/login');
      return;
    }
    const redirect = query.get('state');

    if (type === 'kakaoCallback') {
      handleKakao(code, redirect);
    } else if (type === 'googleCallback') {
      handleGoogle(code, redirect);
    } else if (type === 'naverCallback') {
      handleNaver(code, redirect);
    } else {
      enqueueSnackbar("잘못된 접근 경로입니다.", {variant: 'error'});
      history.replace('/')
    }
  }, [params]);

  return null;
}

export default SnsLogin;