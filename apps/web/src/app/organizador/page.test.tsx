import {
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import OrganizerPage from "./page";

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
        id: "organizer-1",
        name: "Elite Organizer",
        email: "organizer@elite.dev",
        role: "ORGANIZER",
      },
      token: "token-organizer",
      loading: false,
      logout: logoutMock,
    }),
  })
);

const getOrganizerEventsMock = jest.fn();

jest.mock("@/services/events", () => ({
  getOrganizerEvents: (...args: unknown[]) =>
    getOrganizerEventsMock(...args),

  publishEvent: jest.fn(),
  deleteEvent: jest.fn(),
  cancelEvent: jest.fn(),
}));

const baseEvent = {
  tmdbMovieId: 1,
  moviePosterUrl: null,
  dateTime: "2026-09-20T23:00:00.000Z",
  location: "Cine Elite",
  room: "Sala 1",
  price: "40.00",
  capacity: 48,
  organizerId: "organizer-1",
  createdAt: "2026-08-20T00:00:00.000Z",
  updatedAt: "2026-08-20T00:00:00.000Z",
};

describe("OrganizerPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("mostra Excluir e Publicar para evento em rascunho", async () => {
    getOrganizerEventsMock.mockResolvedValue([
      {
        ...baseEvent,
        id: "event-draft",
        movieTitle: "Duna",
        status: "DRAFT",
      },
    ]);

    render(<OrganizerPage />);

    expect(
      await screen.findByText("Duna")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Excluir",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Publicar →",
      })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("button", {
        name: "Cancelar sessão",
      })
    ).not.toBeInTheDocument();
  });

  it("mostra Cancelar sessão para evento publicado", async () => {
    getOrganizerEventsMock.mockResolvedValue([
      {
        ...baseEvent,
        id: "event-published",
        movieTitle: "Interestelar",
        status: "PUBLISHED",
      },
    ]);

    render(<OrganizerPage />);

    expect(
      await screen.findByText("Interestelar")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Cancelar sessão",
      })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("button", {
        name: "Excluir",
      })
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole("button", {
        name: "Publicar →",
      })
    ).not.toBeInTheDocument();
  });

  it("mostra apenas Histórico para evento cancelado", async () => {
    getOrganizerEventsMock.mockResolvedValue([
      {
        ...baseEvent,
        id: "event-cancelled",
        movieTitle: "Oppenheimer",
        status: "CANCELLED",
      },
    ]);

    render(<OrganizerPage />);

    expect(
      await screen.findByText("Oppenheimer")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Histórico")
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("button", {
        name: "Excluir",
      })
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole("button", {
        name: "Publicar →",
      })
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole("button", {
        name: "Cancelar sessão",
      })
    ).not.toBeInTheDocument();
  });
});