import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import GatePage from "./page";

const replaceMock = jest.fn();
const pushMock = jest.fn();
const logoutMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: replaceMock,
    push: pushMock,
  }),
}));

jest.mock(
  "@/components/providers/auth-provider",
  () => ({
    useAuth: () => ({
      user: {
        id: "gate-1",
        name: "Elite Gate",
        email: "gate@elite.dev",
        role: "GATE",
      },
      token: "gate-token",
      loading: false,
      logout: logoutMock,
    }),
  })
);

const getEventsMock = jest.fn();
const validateTicketMock = jest.fn();

jest.mock("@/services/events", () => ({
  getEvents: (...args: unknown[]) =>
    getEventsMock(...args),
}));

jest.mock("@/services/gate", () => ({
  validateTicket: (...args: unknown[]) =>
    validateTicketMock(...args),
}));

const publishedEvent = {
  id: "event-1",
  tmdbMovieId: 1,
  movieTitle: "Interestelar",
  moviePosterUrl: null,
  dateTime: "2026-09-20T23:00:00.000Z",
  location: "Cine Elite",
  room: "Sala 1",
  price: "40.00",
  capacity: 48,
  status: "PUBLISHED" as const,
  organizerId: "organizer-1",
  createdAt: "2026-08-20T00:00:00.000Z",
  updatedAt: "2026-08-20T00:00:00.000Z",
};

describe("GatePage", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    getEventsMock.mockResolvedValue([
      publishedEvent,
    ]);
  });

  it("mostra entrada liberada para ingresso válido", async () => {
    validateTicketMock.mockResolvedValue({
      result: "VALID",
      ticket: {
        id: "ticket-1",
        code: "TKT-VALID123",
      },
    });

    render(<GatePage />);

    await screen.findByText(
      "Interestelar — Sala 1"
    );

    fireEvent.change(
      screen.getByPlaceholderText(
        "TKT-XXXXXXXX"
      ),
      {
        target: {
          value: "TKT-VALID123",
        },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Validar código",
      })
    );

    expect(
      await screen.findByText(
        "Entrada liberada."
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Código TKT-VALID123"
      )
    ).toBeInTheDocument();
  });

  it("mostra aviso para ingresso já utilizado", async () => {
    validateTicketMock.mockResolvedValue({
      result: "ALREADY_USED",
      ticket: {
        id: "ticket-1",
        code: "TKT-USED123",
      },
    });

    render(<GatePage />);

    await screen.findByText(
      "Interestelar — Sala 1"
    );

    fireEvent.change(
      screen.getByPlaceholderText(
        "TKT-XXXXXXXX"
      ),
      {
        target: {
          value: "TKT-USED123",
        },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Validar código",
      })
    );

    expect(
      await screen.findByText(
        "Ingresso já utilizado."
      )
    ).toBeInTheDocument();
  });

  it("mostra entrada não autorizada para ingresso inválido", async () => {
    validateTicketMock.mockResolvedValue({
      result: "INVALID",
    });

    render(<GatePage />);

    await screen.findByText(
      "Interestelar — Sala 1"
    );

    fireEvent.change(
      screen.getByPlaceholderText(
        "TKT-XXXXXXXX"
      ),
      {
        target: {
          value: "TKT-INVALIDO",
        },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Validar código",
      })
    );

    expect(
      await screen.findByText(
        "Entrada não autorizada."
      )
    ).toBeInTheDocument();
  });
});