#define _GNU_SOURCE
#include <errno.h>
#include <netdb.h>
#include <stdio.h>
#include <stdlib.h>
#include <sys/socket.h>

static void record(const char *name) {
  const char *path = getenv("NETWORK_GUARD_LOG");
  if (!path) return;
  FILE *file = fopen(path, "a");
  if (!file) return;
  fprintf(file, "%s\n", name);
  fclose(file);
}

int connect(int socket, const struct sockaddr *address, socklen_t address_len) {
  (void)socket;
  (void)address;
  (void)address_len;
  record("connect");
  errno = ENETUNREACH;
  return -1;
}

ssize_t sendto(int socket, const void *message, size_t length, int flags,
               const struct sockaddr *dest_addr, socklen_t dest_len) {
  (void)socket;
  (void)message;
  (void)length;
  (void)flags;
  (void)dest_addr;
  (void)dest_len;
  record("sendto");
  errno = ENETUNREACH;
  return -1;
}

ssize_t sendmsg(int socket, const struct msghdr *message, int flags) {
  (void)socket;
  (void)message;
  (void)flags;
  record("sendmsg");
  errno = ENETUNREACH;
  return -1;
}

int getaddrinfo(const char *node, const char *service,
                const struct addrinfo *hints, struct addrinfo **result) {
  (void)node;
  (void)service;
  (void)hints;
  (void)result;
  record("getaddrinfo");
  return EAI_FAIL;
}
