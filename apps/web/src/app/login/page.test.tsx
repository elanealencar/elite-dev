import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import LoginPage from "./page";

const pushMock = jest.fn();
const setSessionMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),

  useSearchParams: () => ({
    get: () => null,
  }),
}));

jest.mock(
  "@/components/providers/auth-provider",
  () => ({
    useAuth: () => ({
      setSession: setSessionMock,
    }),
  })
);

const loginRequestMock = jest.fn();

jest.mock("@/services/auth", () => ({
  loginRequest: (...args: unknown[]) =>
    loginRequestMock(...args),
}));

describe("LoginPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("mostra erro quando o login falha", async () => {
    loginRequestMock.mockRejectedValue(
      new Error("E-mail ou senha inválidos")
    );

    render(<LoginPage />);

    fireEvent.change(
      screen.getByLabelText("E-mail"),
      {
        target: {
          value: "teste@elite.dev",
        },
      }
    );

    fireEvent.change(
      screen.getByLabelText("Senha"),
      {
        target: {
          value: "senhaerrada",
        },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Entrar",
      })
    );

    expect(
      await screen.findByText(
        "E-mail ou senha inválidos"
      )
    ).toBeInTheDocument();
  });

  it("redireciona organizer para o painel", async () => {
    loginRequestMock.mockResolvedValue({
      token: "token",
      user: {
        id: "1",
        name: "Organizer",
        email: "organizer@elite.dev",
        role: "ORGANIZER",
      },
    });

    render(<LoginPage />);

    fireEvent.change(
      screen.getByLabelText("E-mail"),
      {
        target: {
          value: "organizer@elite.dev",
        },
      }
    );

    fireEvent.change(
      screen.getByLabelText("Senha"),
      {
        target: {
          value: "Elite@123",
        },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Entrar",
      })
    );

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith(
        "/organizador"
      );
    });
  });
});